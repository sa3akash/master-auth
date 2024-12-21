import { IVerificationCodeDocument } from "@services/interfaces/user.interface";
import { model, Schema } from "mongoose";


const verificationCodeSchema = new Schema<IVerificationCodeDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
      required: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
    },
    ipAddress: {
      type: String,
    },
    type: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true,versionKey: false }
);

export default model<IVerificationCodeDocument>(
  "VerificationCode",
  verificationCodeSchema,
  "VerificationCode"
);
