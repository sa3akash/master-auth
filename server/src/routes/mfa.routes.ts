import { MFAController } from "@controllers/mfa.controller";
import { Router } from "express";


class MfaRoutes {
    private router: Router;
    constructor() {
        this.router = Router();
    }

    public routes(){
        this.router.post('/mfa/setup', MFAController.prototype.generate);
        this.router.post('/mfa/verify', MFAController.prototype.verify);
        this.router.post('/mfa/verify-2fa', MFAController.prototype.login2FA);
        this.router.post('/mfa/off', MFAController.prototype.off2FA);

        return this.router;
    }
}


export const mfaRoutes = new MfaRoutes();