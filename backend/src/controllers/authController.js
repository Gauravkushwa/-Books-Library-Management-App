const User = require("../models/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");

// Register
// Register
const registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Let Mongoose pre-save hook hash password
    user = await User.create({ email, password });

    const token = generateToken(user._id);

    res.status(201).json({
      _id: user._id,
      email: user.email,
      token
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  

  try {
    const user = await User.findOne({ email });
    console.log("User found in DB:", user);

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials - no user" });
    }


    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match result:", isMatch);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials - password mismatch" });
    }

    const token = generateToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({ _id: user._id, email: user.email, token });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};


// Logout
const logoutUser = (req, res) => {
  res.cookie("token", "", { httpOnly: true, expires: new Date(0) });
  res.json({ message: "Logged out" });
};

// Current user
const getMe = (req, res) => {
  res.json(req.user);
};

module.exports = { registerUser, loginUser, logoutUser, getMe };
