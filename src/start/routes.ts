import { Router } from "express";
import publicAuthRoutes from "./routes/auth/public.routes";
import protectedAuthRoutes from "./routes/auth/protected.routes";

const router = Router();

// Public routes
router.use("/auth", publicAuthRoutes);

// Protected routes
router.use("/auth", protectedAuthRoutes);

export default router;
