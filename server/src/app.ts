import express,{ Application } from 'express';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import hpp from 'hpp';
import helmet from 'helmet';
import cors from 'cors';
import http from 'http';
import 'express-async-errors';


import { config } from './config';
import mainRoutes from './routes/index'

export class SetupApplication {
    private app: Application;
    constructor(app:Application) {
        this.app = app;
    }
    public start(){
        this.secureMiddleware(this.app);
        this.standardMiddleware(this.app);
        this.routeMiddleware(this.app);
        this.errorHandlerMiddleware(this.app);
        this.startHttpServer(this.app);
    }

    private secureMiddleware(app:Application){
        app.use(cookieParser());
        app.use(hpp());
        app.use(helmet());
        app.use(cors({
            origin: [config.CLIENT_URL!],
            credentials: true,
            optionsSuccessStatus: 200,
            allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Authorization']
        }))
    }
    private standardMiddleware(app:Application){
        app.use(compression())
    
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
    }
    private routeMiddleware(app:Application){
        mainRoutes(app)
    }
    private errorHandlerMiddleware(app:Application){
        
    }
    private startHttpServer(app:Application){
        const server = new http.Server(app);
        server.listen(3001, () => {
            console.log('Server running on port 3001');
        });
    }
}