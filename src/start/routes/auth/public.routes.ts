import { Router } from "express";
import { AuthController } from "../../../app/controllers/AuthController";
import { validate } from "../../../app/middlewares/validate.middleware";
import {
  registerSchema,
  loginSchema,
} from "../../../app/validations/auth.validation";

const router = Router();
const authController = new AuthController();

router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);

export default router;
