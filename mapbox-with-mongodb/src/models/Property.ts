import mongoose, { Schema, Document } from 'mongoose';
import { PropertyType, ListingType, GeoLocation, PropertyFeature, PropertyImage, PropertyAddress } from '../types';

export interface IProperty extends Document {
    title: string;
    description: string;
    propertyType: PropertyType;
    listingType: ListingType;
    price: number;
    priceUnit?: string;
    area: number;
    areaUnit: string;
    bedrooms: number;
    bathrooms: number;
    features: PropertyFeature[];
    amenities: string[];
    images: PropertyImage[];
    address: PropertyAddress;
    location: GeoLocation;
    agent: mongoose.Types.ObjectId;
    isPublished: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const PropertySchema: Schema = new Schema(
    {
        title: { type: String, required: true, index: true },
        description: { type: String, required: true },
        propertyType: {
            type: String,
            required: true,
            enum: Object.values(PropertyType),
            index: true
        },
        listingType: {
            type: String,
            required: true,
            enum: Object.values(ListingType),
            index: true
        },
        price: { type: Number, required: true, index: true },
        priceUnit: { type: String, default: 'USD' },
        area: { type: Number, required: true },
        areaUnit: { type: String, default: 'sqft' },
        bedrooms: { type: Number, required: true, index: true },
        bathrooms: { type: Number, required: true },
        features: [{
            name: { type: String, required: true },
            value: { type: Schema.Types.Mixed, required: true }
        }],
        amenities: [{ type: String, index: true }],
        images: [{
            url: { type: String, required: true },
            caption: { type: String },
            isPrimary: { type: Boolean, default: false }
        }],
        address: {
            street: { type: String, required: true },
            city: { type: String, required: true, index: true },
            state: { type: String, required: true, index: true },
            zipCode: { type: String, required: true, index: true },
            country: { type: String, required: true },
            formatted: { type: String }
        },
        location: {
            type: {
                type: String,
                enum: ['Point'],
                required: true
            },
            coordinates: {
                type: [Number], // [longitude, latitude]
                required: true
            }
        },
        agent: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        isPublished: { type: Boolean, default: true, index: true },
    },
    {
        timestamps: true
    }
);

// Create a 2dsphere index on the location field for geospatial queries
PropertySchema.index({ location: '2dsphere' });

export default mongoose.model<IProperty>('Property', PropertySchema);
