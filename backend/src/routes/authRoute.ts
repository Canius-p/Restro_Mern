import {
  forgotPassword,
  loginUser,
  registerUser,
} from "../controllers/auth/authController";

const router = require("express").Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/forgotPassword").post(forgotPassword);
module.exports = router;
