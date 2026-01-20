// Express
const express = require("express");
// Router
const router = express.Router();

// User Contollers

const uploadAvatar = require("../controllers/user/uploadAvatar");
const changePass = require("../controllers/user/changePass");
const changeData = require("../controllers/user/changeData");
const getUsers = require("../controllers/user/getUsers");
const getUser = require("../controllers/user/getUser");
const delUser = require("../controllers/user/deleteUser");

const userController = require("../controllers/signupController");

const checkLoginAuth = require("../middleware/checkLoginAuth");
const checkRoleAuth = require("../middleware/checkRoleAuth");

// const verifyAdmin = require("../middlewares/verifyAdmin");

// const protectRoute = require("../lib/verifyToken");




router.route("/").get(userController);

router.route("/upload-avatar").post(checkLoginAuth,uploadAvatar);

// All exist the Token

router.route("/change-pass").put(checkLoginAuth, changePass);

router.route("/change-data").put(checkLoginAuth, changeData);

// Done

router.route("/get-users").get(checkLoginAuth, checkRoleAuth("admin"), getUsers);

router.route("/get-user/:id").get(checkLoginAuth,  getUser);

// <<<<<<< HEAD
router.route("/delete-user/:id").delete(checkLoginAuth,  delUser);
// =======

module.exports = router;
