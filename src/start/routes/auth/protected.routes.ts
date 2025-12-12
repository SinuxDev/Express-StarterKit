import { Router } from "express";
import { AuthController } from "../../../app/controllers/AuthController";
import { authenticate } from "../../../app/middlewares/auth.middleware";
import { validate } from "../../../app/middlewares/validate.middleware";
import {
  updateProfileSchema,
  changePasswordSchema,
} from "../../../app/validations/auth.validation";

const router = Router();
const authController = new AuthController();

// All routes here require authentication
router.use(authenticate);

router.get("/profile", authController.getProfile);
router.put(
  "/profile",
  validate(updateProfileSchema),
  authController.updateProfile
);
router.post(
  "/change-password",
  validate(changePasswordSchema),
  authController.changePassword
);

export default router;
