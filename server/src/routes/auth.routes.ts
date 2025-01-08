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
        this.router.post('/email-verify', AuthController.prototype.verifyEmail);
        this.router.get('/sessions', AuthController.prototype.getAllSession);
        this.router.get('/current', AuthController.prototype.getCurrentUser);
        this.router.post('/forgot', AuthController.prototype.forgotPassword);
        this.router.post('/reset', AuthController.prototype.resetPassword);
        this.router.delete('/session/:sessionId', AuthController.prototype.deleteSession);
        return this.router;
    }
}


export const authRoutes = new AuthRoutes();