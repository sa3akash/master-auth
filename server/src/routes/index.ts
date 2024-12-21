import { Application } from "express";
import { authRoutes } from "@routes/auth.routes";
import { mfaRoutes } from "./mfa.routes";


const BASE_PATH = '/api/v1';

export default (app: Application) => {
  const routes = () => {
    app.use(BASE_PATH, authRoutes.routes());
    app.use(BASE_PATH, mfaRoutes.routes());
    
  };
  routes();
};