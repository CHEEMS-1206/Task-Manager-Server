import User from "../models/EmbedApproach.js";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

export const register = async (req, res) => {
  try {
    const { userName, email, password } = req.body;
    const defaultTask = {
      taskName: "DFT",
      taskDescription:
        "This is the default task, created just after the user is created. It defines the general Structure of the tasks. You cant delete this task.",
      taskId: uuidv4(),
      taskCreatedAt: new Date(),
      taskDeadline: new Date(),
      taskStatus: "Default",
    };
    const tasks = [defaultTask];

    // Email Validation
    if (!validateEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Password Validation
    if (password.length < 8 || password.length > 12) {
      return res
        .status(400)
        .json({
          message: "Password must be exactly in between 8 to 12 characters.",
        });
    }
    const user = new User({ email, password, userName, tasks });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
      // Duplicate email error
      res.status(500).json({ message: "Another user exists with this Email." });
    } else if (
      error.code === 11000 &&
      error.keyPattern &&
      error.keyPattern.userName
    ) {
      // Duplicate username error
      res
        .status(500)
        .json({ message: "Another user exists with this Username." });
    } else {
      // Handle other errors or unexpected scenarios
      res.status(500).json({ message: "An unexpected error occurred." });
    }
  }
};

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export const login = async (req, res) => {
  try {
    const { userName, password } = req.body;
    const user = await User.findOne({ userName: userName });
    if (!user) {
      return res
        .status(401)
        .json({ message: "No user found with this username." });
    }
    const validPassword = password === user.password;
    if (!validPassword) {
      return res.status(401).json({ message: "Incorrect password." });
    }
    const token = jwt.sign({ userName: userName }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
