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
    expiredAt: {
      type: Date,
      required: true,
      default: thirtyDaysFromNow,
    },
  },
  { timestamps: true }
);

export default model("Session", SessionSchema, "Session");
