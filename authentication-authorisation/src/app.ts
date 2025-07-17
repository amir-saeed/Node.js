import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import userRoutes from './routes/user.routes';
import authRoutes from './routes/auth.routes';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger/swagger.config';

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Add your routes here

app.get("/health", (req: Request, res: Response) => {
    res.status(200).json({
        status: 'Ok',
        message: "Welcome to the API",
        timestamp: new Date().toISOString()
    });
})

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        status: 404,
        message: "Not Found",
        error: "The requested resource could not be found."
    });
})

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({
        status: 500,
        message: "Internal Server Error",
        error: process.env.NODE_ENV == 'development' ? err.message : "An unexpected error occurred."
    });
})

export default app;