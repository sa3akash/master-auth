import { SetupApplication } from "./app";
import express from "express";
import { config } from "./config";

class MainServer {
    public initialize() {
        const app = express();
        const setupServer:SetupApplication = new SetupApplication(app)
        config.validateConfig()
        setupServer.start();
    }
}

const mainServer = new MainServer();
mainServer.initialize();