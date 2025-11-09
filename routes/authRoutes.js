const express = require("express");
const router = express.Router();
const loginController = require("../controllers/loginController");
const signupController = require("../controllers/signupController");
const checkLoginAuth = require("../middleware/checkLoginAuth");
const checkRoleAuth = require("../middleware/checkRoleAuth");

router.post("/login", loginController);
router.post("/register", signupController);
router.get("/profile", checkLoginAuth, (req, res) => {
  res.json({ user: req.user });
});
router.get("/admin", checkLoginAuth, checkRoleAuth("admin"), (req, res) => {
  res.json({ message: "Welcome Admin" });
});

module.exports = router;
