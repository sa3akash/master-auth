import sessionModel from "@models/sessionModel";
import userModel from "@models/userModel";
import verificationModel from "@models/verificationModel";
import { VerificationEnum } from "@services/interfaces/enum";
import { IRegisterData, ISessionDocument, IUserDocument } from "@services/interfaces/user.interface";
import { generateSixDigitNumber } from "@services/utils/common";


class AuthService {
    public async getUserByEmail(email: string): Promise<IUserDocument | null>{
        return await userModel.findOne({email})
    }
    public async getUserById(id: string): Promise<IUserDocument | null>{
        return await userModel.findById(id)
    }
    public async createUser(data:IRegisterData): Promise<IUserDocument | null>{
        return await userModel.create(data)
    }
    public async getVerification(data:{id:string,code:string,type:VerificationEnum}){
        return await verificationModel.findOne({
            userId: data.id,
            code:data.code,
            type: data.type,
            // expiresAt: { $gt: new Date() },
        })
    }
    public async createVerification(data:{userId:string}){
        return await verificationModel.create({
            userId: data.userId,
            code: generateSixDigitNumber(),
            type: VerificationEnum.EMAIL_VERIFICATION,
            expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes expiry time
          });
    }
  
}

export const authService = new AuthService();