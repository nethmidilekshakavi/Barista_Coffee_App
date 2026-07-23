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

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});