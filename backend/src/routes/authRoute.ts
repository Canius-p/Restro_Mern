import {
  forgotPassword,
  loginUser,
  registerUser,
  verifyOtp,
} from "../controllers/auth/authController";

const router = require("express").Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/forgotPassword").post(forgotPassword);
router.route("/verifyotp").post(verifyOtp);
module.exports = router;
