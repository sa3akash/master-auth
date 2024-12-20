import sessionModel from "@models/sessionModel";
import userModel from "@models/userModel";
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
  
}

export const authService = new AuthService();