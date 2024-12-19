import { config } from '@root/config';
import jwt from 'jsonwebtoken';

class JWTService {

    public signToken(){

    }

    public verifyToken(token: string)  {
        return jwt.verify(token, config.JWT_SEC!) as { id: string,sessionId:string };
    }

} 


export const jwtService:JWTService = new JWTService()