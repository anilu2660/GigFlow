import express from "express";
import { registerUser, loginUser, getMe } from "../controllers/authController";
import { protect } from "../middlewares/authMiddleware";
import { validateRequest } from "../middlewares/validateRequest";
import { registerSchema, loginSchema } from "../validations";

const router = express.Router();

router.post("/register", validateRequest(registerSchema), registerUser);
router.post("/login", validateRequest(loginSchema), loginUser);
router.get("/me", protect, getMe);

export default router;
