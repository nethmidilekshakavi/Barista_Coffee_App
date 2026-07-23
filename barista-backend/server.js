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

    // basic validation
    if (!firstName || !lastName || !email || !mobile || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // check if email or mobile already exists
    const [existing] = await pool.query(
      "SELECT id FROM users WHERE email = ? OR mobile = ?",
      [email, mobile]
    );

    if (existing.length > 0) {
      return res.status(409).json({ message: "Email or mobile already registered" });
    }

    // hash the password before saving (never store plain text password)
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

    // Match by email OR by the last 9 digits of the stored mobile number,
    // regardless of whether it's stored/entered with +94, 0, or nothing.
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});