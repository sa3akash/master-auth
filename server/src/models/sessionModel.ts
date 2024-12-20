import { ISessionDocument } from "@services/interfaces/user.interface";
import { thirtyDaysFromNow } from "@services/utils/date-time";
import { model, Schema } from "mongoose";

const SessionSchema = new Schema<ISessionDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userAgent: {
      type: String,
    },
    ipAddress: {
      type: String,
    },
    isOnline: {
      type: Boolean,
    },
    resticted: {
      type: Boolean,
      default: false,
    },
    expiredAt: {
      type: Date,
      required: true,
      default: thirtyDaysFromNow,
    },
  },
  { timestamps: true, versionKey: false }
);

export default model("Session", SessionSchema, "Session");
