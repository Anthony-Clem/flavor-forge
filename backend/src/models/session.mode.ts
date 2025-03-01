import mongoose, { Document } from "mongoose";

export interface SessionDocument extends Document {
  userId: mongoose.Types.ObjectId;
  expiresAt: Date;
}

const sessionSchema = new mongoose.Schema<SessionDocument>(
  {
    userId: {
      ref: "User",
      type: mongoose.Schema.Types.ObjectId,
      index: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      default: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  },
  { timestamps: true }
);

const SessionModel = mongoose.model<SessionDocument>("Session", sessionSchema);
export default SessionModel;
