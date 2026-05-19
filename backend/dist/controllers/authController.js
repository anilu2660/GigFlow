"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.loginUser = exports.registerUser = void 0;
const User_1 = __importDefault(require("../models/User"));
const generateToken_1 = __importDefault(require("../utils/generateToken"));
const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const userExists = await User_1.default.findOne({ email });
        if (userExists) {
            res.status(400).json({ success: false, message: "User already exists" });
            return;
        }
        const user = await User_1.default.create({
            name,
            email,
            password,
            role,
        });
        if (user) {
            res.status(201).json({
                success: true,
                message: "User registered successfully",
                data: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
            });
            return;
        }
        else {
            res.status(400).json({ success: false, message: "Invalid user data" });
            return;
        }
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
        return;
    }
};
exports.registerUser = registerUser;
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User_1.default.findOne({ email });
        if (user && (await user.matchPassword(password))) {
            const token = (0, generateToken_1.default)(user._id, user.role);
            res.status(200).json({
                success: true,
                message: "Login successful",
                token,
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
            });
            return;
        }
        else {
            res.status(401).json({ success: false, message: "Invalid email or password" });
            return;
        }
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
        return;
    }
};
exports.loginUser = loginUser;
const getMe = async (req, res) => {
    try {
        const user = await User_1.default.findById(req.user?._id).select("-password");
        if (user) {
            res.status(200).json({
                success: true,
                data: user,
            });
            return;
        }
        else {
            res.status(404).json({ success: false, message: "User not found" });
            return;
        }
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
        return;
    }
};
exports.getMe = getMe;
