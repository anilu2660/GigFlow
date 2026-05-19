"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const validateRequest_1 = require("../middlewares/validateRequest");
const validations_1 = require("../validations");
const router = express_1.default.Router();
router.post("/register", (0, validateRequest_1.validateRequest)(validations_1.registerSchema), authController_1.registerUser);
router.post("/login", (0, validateRequest_1.validateRequest)(validations_1.loginSchema), authController_1.loginUser);
router.get("/me", authMiddleware_1.protect, authController_1.getMe);
exports.default = router;
