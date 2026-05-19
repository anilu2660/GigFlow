import mongoose, { Document, Schema } from "mongoose";

export interface ILead extends Document {
  name: string;
  email: string;
  status: "new" | "contacted" | "qualified" | "lost";
  source: "website" | "instagram" | "referral";
  assignedTo?: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const leadSchema = new Schema<ILead>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    status: {
      type: String,
      enum: ["new", "contacted", "qualified", "lost"],
      default: "new",
    },
    source: {
      type: String,
      enum: ["website", "instagram", "referral"],
      default: "website",
    },
    assignedTo: { type: Schema.Types.ObjectId, ref: "User" },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

// Indexes
leadSchema.index({ status: 1 });
leadSchema.index({ source: 1 });

export default mongoose.model<ILead>("Lead", leadSchema);
