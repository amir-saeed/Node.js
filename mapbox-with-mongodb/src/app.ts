import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db';
import { config } from './config/config';

import './models/index';

import propertyRoutes from './routes/propertyRoutes';
import userRoutes from './routes/userRoutes';

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/properties', propertyRoutes);
app.use('/api/users', userRoutes);

// Health check route
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

// Start server
const PORT = config.port;
app.listen(PORT, () => {
    console.log(`Server running in ${config.environment} mode on port ${PORT}`);
});

export default app;