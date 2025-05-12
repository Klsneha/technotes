import { Router } from "express";
import { loginLimiter } from "../middleware/loginLimiter";
import { authController } from "../Controllers/authController";
export const router = Router();
router.route("/")
  .post(loginLimiter, authController.login);

router.route("/refresh")
  .get(authController.refresh);

router.route("/logout")
  .post(authController.logout);

