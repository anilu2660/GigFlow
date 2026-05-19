"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const leadController_1 = require("../controllers/leadController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const validateRequest_1 = require("../middlewares/validateRequest");
const validations_1 = require("../validations");
const router = express_1.default.Router();
router.use(authMiddleware_1.protect); // All lead routes require authentication
router.get("/export/csv", (0, authMiddleware_1.authorizeRoles)("admin"), leadController_1.exportCSV);
router.route("/")
    .get(leadController_1.getLeads)
    .post((0, validateRequest_1.validateRequest)(validations_1.createLeadSchema), leadController_1.createLead);
router.route("/:id")
    .get(leadController_1.getLeadById)
    .put((0, validateRequest_1.validateRequest)(validations_1.updateLeadSchema), leadController_1.updateLead)
    .delete((0, authMiddleware_1.authorizeRoles)("admin"), leadController_1.deleteLead);
exports.default = router;
