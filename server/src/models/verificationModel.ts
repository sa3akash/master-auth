import { IVerificationCodeDocument } from "@services/interfaces/user.interface";
import { generateSixDigitNumber } from "@services/utils/common";
import { model, Schema } from "mongoose";

const sixDigitNumber = generateSixDigitNumber();

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
      default: `${sixDigitNumber}`,
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
