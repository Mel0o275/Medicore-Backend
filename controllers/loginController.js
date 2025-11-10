const User = require("../model/users");
const bcrypt = require("bcrypt");
const sign = require("jwt-encode");
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    // Check password (compare supplied password with stored hashed password)
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    // Generate token
    const token = sign(user, process.env.SECRET_KEY);

    res.status(200).json({
      message: "User logged in successfully",
      data: { token, id: user._id, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = login;
