"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const leadRoutes_1 = __importDefault(require("./routes/leadRoutes"));
const app = (0, express_1.default)();
// Middleware
app.use(express_1.default.json());
app.use((0, cors_1.default)({ origin: process.env.CLIENT_URL, credentials: true }));
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)("dev"));
// Base route
app.get("/", (req, res) => {
    res.send("API is running...");
});
// Routes
app.use("/api/auth", authRoutes_1.default);
app.use("/api/leads", leadRoutes_1.default);
// Error handling middleware
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
        success: false,
        message: err.message || "Server Error",
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
    });
});
exports.default = app;
