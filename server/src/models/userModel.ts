import {
  IUserDocument,
  IUserPreferences,
} from "@services/interfaces/user.interface";
import mongoose from "mongoose";
import bcrypt from 'bcryptjs';

const userPreferencesSchema = new mongoose.Schema<IUserPreferences>({
  enable2FA: { type: Boolean, default: false },
  emailNotification: { type: Boolean, default: true },
  twoFactorSecret: { type: String, required: false },
});

const userSchema = new mongoose.Schema<IUserDocument>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    emailVerified: {
      type: Date,
      default: null,
    },
    profilePicture: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      default: 'USER',
      enum: ['ADMIN', 'MANAGER', 'USER'],
    },
    userPreferences: {
      type: userPreferencesSchema,
      default: {},
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      transform(_doc, ret) {
        delete ret.password;
        return ret;
      },
    },
  }
);

userSchema.pre('save', async function (this: IUserDocument, next: () => void){
    const hashPassword = await bcrypt.hash(this.password,10)
    this.password = hashPassword;
    next();
})

userSchema.methods.comparePassword = async function (password:string):Promise<boolean>{
    const hashPassword = this.password;
    return await bcrypt.compare(password, hashPassword);
}

userSchema.methods.hashPassword = async function (password: string):Promise<string>{
    return await bcrypt.hash(password,10)
}

export default mongoose.model<IUserDocument>("User", userSchema,"User");