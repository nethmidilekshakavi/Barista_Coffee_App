require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const pool = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

// ---------- SIGNUP ENDPOINT ----------
app.post("/api/signup", async (req, res) => {
  try {
    const { title, firstName, lastName, email, mobile, password } = req.body;

    if (!firstName || !lastName || !email || !mobile || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const [existing] = await pool.query(
      "SELECT id FROM users WHERE email = ? OR mobile = ?",
      [email, mobile]
    );

    if (existing.length > 0) {
      return res.status(409).json({ message: "Email or mobile already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      `INSERT INTO users (title, first_name, last_name, email, mobile, password)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [title || null, firstName, lastName, email, mobile, hashedPassword]
    );

    return res.status(201).json({
      message: "Account created successfully",
      userId: result.insertId,
    });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ message: "Server error, try again later" });
  }
});

// ---------- LOGIN ENDPOINT ----------
app.post("/api/login", async (req, res) => {
  try {
    const { emailOrMobile, password } = req.body;

    if (!emailOrMobile || !password) {
      return res.status(400).json({ message: "Email/mobile and password are required" });
    }

    // Normalize: keep only digits, then take the last 9
    // (Sri Lankan mobile numbers are 9 digits after the leading 0 or +94)
    const digitsOnly = emailOrMobile.replace(/\D/g, "");
    const last9Digits = digitsOnly.slice(-9);

    const [rows] = await pool.query(
      `SELECT * FROM users
       WHERE email = ?
       OR RIGHT(REGEXP_REPLACE(mobile, '[^0-9]', ''), 9) = ?`,
      [emailOrMobile, last9Digits]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid email/mobile or password" });
    }

    const user = rows[0];
    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      return res.status(401).json({ message: "Invalid email/mobile or password" });
    }

    const { password: _, ...userWithoutPassword } = user;

    return res.status(200).json({
      message: "Login successful",
      user: userWithoutPassword,
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error, try again later" });
  }
});

// =====================================================
// ---------- FORGOT PASSWORD FLOW (3 steps) ----------
// =====================================================

// STEP 1: Send OTP code to mobile number
app.post("/api/forgot-password/send-code", async (req, res) => {
  try {
    const { mobile } = req.body; // expects e.g. "+94771234567"

    if (!mobile) {
      return res.status(400).json({ message: "Mobile number is required" });
    }

    const digitsOnly = mobile.replace(/\D/g, "");
    const last9Digits = digitsOnly.slice(-9);

    const [rows] = await pool.query(
      `SELECT id FROM users WHERE RIGHT(REGEXP_REPLACE(mobile, '[^0-9]', ''), 9) = ?`,
      [last9Digits]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "No account found with this mobile number" });
    }

    // generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 5 * 60 * 1000); // valid for 5 minutes

    await pool.query(
      `UPDATE users SET reset_otp = ?, reset_otp_expires = ?
       WHERE RIGHT(REGEXP_REPLACE(mobile, '[^0-9]', ''), 9) = ?`,
      [otp, expires, last9Digits]
    );

    // 🚧 NOTE: No real SMS gateway connected yet.
    // For now the OTP is just printed to the server console so you can test.
    // To actually text the code to the phone, sign up for an SMS API
    // (e.g. Twilio, Dialog, Notify.lk) and call it here instead of console.log.
    console.log(`📱 OTP for ${mobile}: ${otp}`);

    return res.status(200).json({
      message: "Verification code sent",
      // ⚠️ remove `otp` from the response once a real SMS gateway is wired up —
      // it's only here temporarily so you can test without SMS.
      otp,
    });
  } catch (err) {
    console.error("Send code error:", err);
    return res.status(500).json({ message: "Server error, try again later" });
  }
});

// STEP 2: Verify the OTP code
app.post("/api/forgot-password/verify-code", async (req, res) => {
  try {
    const { mobile, code } = req.body;

    if (!mobile || !code) {
      return res.status(400).json({ message: "Mobile number and code are required" });
    }

    const digitsOnly = mobile.replace(/\D/g, "");
    const last9Digits = digitsOnly.slice(-9);

    const [rows] = await pool.query(
      `SELECT reset_otp, reset_otp_expires FROM users
       WHERE RIGHT(REGEXP_REPLACE(mobile, '[^0-9]', ''), 9) = ?`,
      [last9Digits]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "No account found with this mobile number" });
    }

    const user = rows[0];

    if (!user.reset_otp || !user.reset_otp_expires) {
      return res.status(400).json({ message: "No code was requested. Please request a new one." });
    }

    if (new Date() > new Date(user.reset_otp_expires)) {
      return res.status(400).json({ message: "Code has expired. Please request a new one." });
    }

    if (user.reset_otp !== code) {
      return res.status(400).json({ message: "Incorrect code" });
    }

    return res.status(200).json({ message: "Code verified" });
  } catch (err) {
    console.error("Verify code error:", err);
    return res.status(500).json({ message: "Server error, try again later" });
  }
});

// STEP 3: Reset the password
app.post("/api/forgot-password/reset-password", async (req, res) => {
  try {
    const { mobile, code, newPassword } = req.body;

    if (!mobile || !code || !newPassword) {
      return res.status(400).json({ message: "Mobile, code, and new password are required" });
    }

    const digitsOnly = mobile.replace(/\D/g, "");
    const last9Digits = digitsOnly.slice(-9);

    const [rows] = await pool.query(
      `SELECT id, reset_otp, reset_otp_expires FROM users
       WHERE RIGHT(REGEXP_REPLACE(mobile, '[^0-9]', ''), 9) = ?`,
      [last9Digits]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "No account found with this mobile number" });
    }

    const user = rows[0];

    // re-check the OTP again here, so someone can't skip straight to this endpoint
    if (
      !user.reset_otp ||
      !user.reset_otp_expires ||
      new Date() > new Date(user.reset_otp_expires) ||
      user.reset_otp !== code
    ) {
      return res.status(400).json({ message: "Invalid or expired code" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await pool.query(
      `UPDATE users
       SET password = ?, reset_otp = NULL, reset_otp_expires = NULL
       WHERE id = ?`,
      [hashedPassword, user.id]
    );

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Reset password error:", err);
    return res.status(500).json({ message: "Server error, try again later" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});