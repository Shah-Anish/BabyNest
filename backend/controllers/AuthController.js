import User from "../model/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Register Parent
export const register = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    if (role && role !== "parent") {
      return res.status(403).json({
        message: "Admin registration is not allowed. Role changes must be done by database/admin only."
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      role: "parent"
    });

    res.status(201).json({
      message: "Parent registered successfully",
      user
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Login (Parent or Admin)
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      user
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};