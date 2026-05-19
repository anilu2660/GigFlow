"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardStats = exports.exportCSV = exports.deleteLead = exports.updateLead = exports.getLeadById = exports.getLeads = exports.createLead = void 0;
const Lead_1 = __importDefault(require("../models/Lead"));
const json2csv_1 = require("json2csv");
const createLead = async (req, res) => {
    try {
        const { name, email, status, source, assignedTo } = req.body;
        const lead = await Lead_1.default.create({
            name,
            email,
            status,
            source,
            assignedTo,
            createdBy: req.user?._id,
        });
        res.status(201).json({ success: true, message: "Lead created successfully", data: lead });
    }
    catch (error) {
        if (error.code === 11000) {
            res.status(400).json({ success: false, message: "A lead with this email already exists" });
            return;
        }
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.createLead = createLead;
const getLeads = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const { status, source, search, sort } = req.query;
        const query = {};
        if (req.user?.role === "sales") {
            query.$or = [{ assignedTo: req.user._id }, { createdBy: req.user._id }];
        }
        if (status)
            query.status = status;
        if (source)
            query.source = source;
        if (search) {
            const searchRegex = { $regex: search, $options: "i" };
            const searchOr = [{ name: searchRegex }, { email: searchRegex }];
            if (query.$or) {
                query.$and = [{ $or: query.$or }, { $or: searchOr }];
                delete query.$or;
            }
            else {
                query.$or = searchOr;
            }
        }
        const sortOption = {};
        if (sort === "oldest") {
            sortOption.createdAt = 1;
        }
        else {
            sortOption.createdAt = -1;
        }
        const total = await Lead_1.default.countDocuments(query);
        const leads = await Lead_1.default.find(query)
            .populate("assignedTo", "name email")
            .populate("createdBy", "name email")
            .sort(sortOption)
            .skip((page - 1) * limit)
            .limit(limit);
        res.status(200).json({
            success: true,
            data: leads,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit),
                limit,
            },
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getLeads = getLeads;
const getLeadById = async (req, res) => {
    try {
        const lead = await Lead_1.default.findById(req.params.id)
            .populate("assignedTo", "name email")
            .populate("createdBy", "name email");
        if (!lead) {
            res.status(404).json({ success: false, message: "Lead not found" });
            return;
        }
        if (req.user?.role === "sales") {
            const isOwner = lead.createdBy.toString() === req.user._id.toString();
            const isAssigned = lead.assignedTo?.toString() === req.user._id.toString();
            if (!isOwner && !isAssigned) {
                res.status(403).json({ success: false, message: "Not authorized to view this lead" });
                return;
            }
        }
        res.status(200).json({ success: true, data: lead });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getLeadById = getLeadById;
const updateLead = async (req, res) => {
    try {
        const lead = await Lead_1.default.findById(req.params.id);
        if (!lead) {
            res.status(404).json({ success: false, message: "Lead not found" });
            return;
        }
        if (req.user?.role === "sales") {
            const isOwner = lead.createdBy.toString() === req.user._id.toString();
            const isAssigned = lead.assignedTo?.toString() === req.user._id.toString();
            if (!isOwner && !isAssigned) {
                res.status(403).json({ success: false, message: "Not authorized to update this lead" });
                return;
            }
        }
        const updatedLead = await Lead_1.default.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        res.status(200).json({ success: true, message: "Lead updated successfully", data: updatedLead });
    }
    catch (error) {
        if (error.code === 11000) {
            res.status(400).json({ success: false, message: "A lead with this email already exists" });
            return;
        }
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.updateLead = updateLead;
const deleteLead = async (req, res) => {
    try {
        const lead = await Lead_1.default.findById(req.params.id);
        if (!lead) {
            res.status(404).json({ success: false, message: "Lead not found" });
            return;
        }
        if (req.user?.role === "sales") {
            const isOwner = lead.createdBy.toString() === req.user._id.toString();
            const isAssigned = lead.assignedTo?.toString() === req.user._id.toString();
            if (!isOwner && !isAssigned) {
                res.status(403).json({ success: false, message: "Not authorized to delete this lead" });
                return;
            }
        }
        await lead.deleteOne();
        res.status(200).json({ success: true, message: "Lead deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.deleteLead = deleteLead;
const exportCSV = async (req, res) => {
    try {
        const query = {};
        if (req.user?.role === "sales") {
            query.$or = [{ assignedTo: req.user._id }, { createdBy: req.user._id }];
        }
        const leads = await Lead_1.default.find(query).lean();
        const fields = ["name", "email", "status", "source", "createdAt"];
        const json2csvParser = new json2csv_1.Parser({ fields });
        const csv = json2csvParser.parse(leads);
        res.header("Content-Type", "text/csv");
        res.attachment("leads.csv");
        res.send(csv);
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.exportCSV = exportCSV;
const getDashboardStats = async (req, res) => {
    try {
        const matchStage = {};
        if (req.user?.role === "sales") {
            matchStage.$or = [{ assignedTo: req.user._id }, { createdBy: req.user._id }];
        }
        const totalLeads = await Lead_1.default.countDocuments(matchStage);
        const newLeads = await Lead_1.default.countDocuments({ ...matchStage, status: "new" });
        const qualifiedLeads = await Lead_1.default.countDocuments({ ...matchStage, status: "qualified" });
        const lostLeads = await Lead_1.default.countDocuments({ ...matchStage, status: "lost" });
        const statusDistribution = await Lead_1.default.aggregate([
            { $match: matchStage },
            { $group: { _id: "$status", count: { $sum: 1 } } },
            { $project: { name: "$_id", value: "$count", _id: 0 } }
        ]);
        const sourceDistribution = await Lead_1.default.aggregate([
            { $match: matchStage },
            { $group: { _id: "$source", count: { $sum: 1 } } },
            { $project: { name: "$_id", value: "$count", _id: 0 } }
        ]);
        res.status(200).json({
            success: true,
            data: {
                totalLeads,
                newLeads,
                qualifiedLeads,
                lostLeads,
                statusDistribution,
                sourceDistribution
            }
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getDashboardStats = getDashboardStats;
