import { ObjectId } from "mongoose";
import { VerificationEnum } from "./enum";

export interface IUserDocument extends Document {
  _id?: string;
  profilePicture?: string;
  name: string;
  username: string;
  role: 'ADMIN' | 'MANAGER'| 'USER';
  email: string;
  emailVerified?: Date;
  userPreferences: IUserPreferences;

  password: string;
  createdAt?: Date;
  updatedAt?: Date;
  comparePassword(password: string): Promise<boolean>;
  hashPassword(password: string): Promise<string>;
}

export interface IUserPreferences {
  enable2FA: boolean;
  emailNotification: boolean;
  twoFactorSecret: string;
}

export interface IUser {
  id: number;
}

export interface ISessionDocument extends Document {
  userId: ObjectId;
  userAgent?: string;
  expiredAt: Date;
  createdAt?: Date;
}

export interface IVerificationCodeDocument extends Document {
  userId: ObjectId;
  code: string;
  type: VerificationEnum;
  expiresAt: Date;
  createdAt: Date;
}
