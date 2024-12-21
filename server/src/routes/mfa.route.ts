import { MFAController } from "@controllers/mfa.controller";
import { Router } from "express";


class MfaRoutes {
    private router: Router;
    constructor() {
        this.router = Router();
    }

    public routes(){
        this.router.post('/setup', MFAController.prototype.generate);

        return this.router;
    }
}


export const mfaRoutes = new MfaRoutes();