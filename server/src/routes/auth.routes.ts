import { AuthController } from "@controllers/auth.controller";
import { Router } from "express";


class AuthRoutes {
    private router: Router;
    constructor() {
        this.router = Router();
    }

    public routes(){
        this.router.post('/signup', AuthController.prototype.register);
        this.router.post('/signin', AuthController.prototype.login);
        this.router.post('/refresh', AuthController.prototype.refreshTokenGenerate);
        this.router.post('/logout', AuthController.prototype.logOut);
        this.router.delete('/session', AuthController.prototype.deleteSession);
        this.router.get('/sessions', AuthController.prototype.getAllSession);
        return this.router;
    }
}


export const authRoutes = new AuthRoutes();