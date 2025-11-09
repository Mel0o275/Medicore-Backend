const jwt = require("jsonwebtoken");

const checkLoginAuth = (req, res, next) => {
  const token = req.headers.authorization;
  console.log("Token received in middleware:", token);

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: error.message });
  }
};

module.exports = checkLoginAuth;
