const jwt = require("jsonwebtoken");

const checkRoleAuth = (requiredRole) => {
  return (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      req.user = decoded;

      if (req.user && req.user.role === requiredRole) {
        return next();
      }
      return res.status(403).json({ message: "Forbidden" });
    } catch (error) {
      return res.status(401).json({ message: error.message });
    }
  };
};

module.exports = checkRoleAuth;
