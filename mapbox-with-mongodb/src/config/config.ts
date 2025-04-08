import dotenv from 'dotenv';

dotenv.config();

export const config = {
    port: process.env.PORT || 3000,
    mongoURI: process.env.MONGODB_URI || 'mongodb://localhost:27017/property_finder',
    mapboxApiKey: process.env.MAPBOX_API_KEY || '',
    environment: process.env.NODE_ENV || 'development'
};