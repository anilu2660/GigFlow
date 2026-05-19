"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app_1 = __importDefault(require("./app"));
const db_1 = __importDefault(require("./config/db"));
// Cloud Run will inject 8080, local dev will fallback to 5000
const PORT = process.env.PORT || 5000;
const startServer = async () => {
    await (0, db_1.default)();
    // Highlight-start: Add '0.0.0.0' as the second argument
    app_1.default.listen(PORT, '0.0.0.0', () => {
        console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });
    // Highlight-end
};
startServer();
