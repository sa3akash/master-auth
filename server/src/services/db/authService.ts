import sessionModel from "@models/sessionModel";
import userModel from "@models/userModel";
import verificationModel from "@models/verificationModel";
import { VerificationEnum } from "@services/interfaces/enum";
import { IRegisterData, ISessionDocument, IUserDocument } from "@services/interfaces/user.interface";


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
  
}

export const authService = new AuthService();