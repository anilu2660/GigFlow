import { Request, Response } from "express";
import Lead from "../models/Lead";
import { Parser } from "json2csv";

export const createLead = async (req: Request, res: Response) => {
  try {
    const { name, email, status, source, assignedTo } = req.body;

    const lead = await Lead.create({
      name,
      email,
      status,
      source,
      assignedTo,
      createdBy: req.user?._id,
    });

    res.status(201).json({ success: true, message: "Lead created successfully", data: lead });
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(400).json({ success: false, message: "A lead with this email already exists" });
      return;
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getLeads = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const { status, source, search, sort } = req.query;

    const query: any = {};

    if (req.user?.role === "sales") {
      query.$or = [{ assignedTo: req.user._id }, { createdBy: req.user._id }];
    }

    if (status) query.status = status;
    if (source) query.source = source;

    if (search) {
      const searchRegex = { $regex: search, $options: "i" };
      const searchOr = [{ name: searchRegex }, { email: searchRegex }];

      if (query.$or) {
        query.$and = [{ $or: query.$or }, { $or: searchOr }];
        delete query.$or;
      } else {
        query.$or = searchOr;
      }
    }

    const sortOption: any = {};
    if (sort === "oldest") {
      sortOption.createdAt = 1;
    } else {
      sortOption.createdAt = -1;
    }

    const total = await Lead.countDocuments(query);
    const leads = await Lead.find(query)
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
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getLeadById = async (req: Request, res: Response) => {
  try {
    const lead = await Lead.findById(req.params.id)
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
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateLead = async (req: Request, res: Response) => {
  try {
    const lead = await Lead.findById(req.params.id);

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

    const updatedLead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, message: "Lead updated successfully", data: updatedLead });
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(400).json({ success: false, message: "A lead with this email already exists" });
      return;
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteLead = async (req: Request, res: Response) => {
  try {
    const lead = await Lead.findById(req.params.id);

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
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const exportCSV = async (req: Request, res: Response) => {
  try {
    const query: any = {};

    if (req.user?.role === "sales") {
      query.$or = [{ assignedTo: req.user._id }, { createdBy: req.user._id }];
    }

    const leads = await Lead.find(query).lean();

    const fields = ["name", "email", "status", "source", "createdAt"];
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(leads);

    res.header("Content-Type", "text/csv");
    res.attachment("leads.csv");
    res.send(csv);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const matchStage: any = {};
    if (req.user?.role === "sales") {
      matchStage.$or = [{ assignedTo: req.user._id }, { createdBy: req.user._id }];
    }

    const totalLeads = await Lead.countDocuments(matchStage);
    const newLeads = await Lead.countDocuments({ ...matchStage, status: "new" });
    const qualifiedLeads = await Lead.countDocuments({ ...matchStage, status: "qualified" });
    const lostLeads = await Lead.countDocuments({ ...matchStage, status: "lost" });

    const statusDistribution = await Lead.aggregate([
      { $match: matchStage },
      { $group: { _id: "$status", count: { $sum: 1 } } },
      { $project: { name: "$_id", value: "$count", _id: 0 } }
    ]);

    const sourceDistribution = await Lead.aggregate([
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
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
