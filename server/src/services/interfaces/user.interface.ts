import { ObjectId } from "mongoose";
import { VerificationEnum } from "./enum";

export interface IUserDocument extends Document {
  _id?: string;
  profilePicture?: string;
  name: string;
  role: 'ADMIN' | 'MANAGER'| 'USER';
  email: string;
  emailVerified: Date;
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
  _id?: string;
  userId: ObjectId;
  isOnline: boolean;
  userAgent?: string;
  resticted: boolean;
  ipAddress?: string;
  expiredAt: Date;
  createdAt?: Date;
}

export interface IVerificationCodeDocument extends Document {
  userId: ObjectId;
  code: string;
  type: VerificationEnum;
  ipAddress?: string;
  expiresAt: Date;
  createdAt: Date;
}


export interface IRegisterData {
  name: string;
  email: string;
  password: string;
}
