const bcrypt = require("bcrypt");
const User = require("../model/users");

const SALT_ROUNDS = 10;

const register = async (req, res) => {
  const {
    firstName,
    secondName,
    phoneNumber,
    email,
    password,
    gender,
    dateOfBirth,
  } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password in controller
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Create new user (role defaults to 'user')
    const user = new User({
      firstName,
      secondName,
      phoneNumber,
      email,
      password: hashedPassword,
      gender: gender,
      dateOfBirth: dateOfBirth,
      // role: "admin",
    });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = register;
