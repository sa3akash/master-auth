import { SetupApplication } from "@root/app";
import express from "express";
import { config } from "@root/config";
import { IUserDocument } from "@services/interfaces/user.interface";
import { dbConnect } from "@root/dbConnect";

declare global {
    namespace Express {
        interface Request {
            user?: IUserDocument;
            sessionId?: string;
        }
    }
}

class MainServer {
    public initialize() {
        const app = express();
        const setupServer:SetupApplication = new SetupApplication(app)
        config.validateConfig()
        dbConnect()
        setupServer.start();
    }
}

const mainServer = new MainServer();
mainServer.initialize();