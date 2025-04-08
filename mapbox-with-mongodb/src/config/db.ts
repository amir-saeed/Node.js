import mongoose from 'mongoose';
import { config } from './config';

export const connectDB = async (): Promise<void> => {
    try {
        await mongoose.connect(config.mongoURI);
        console.log('MongoDB Connected');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
};