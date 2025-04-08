import { Request, Response } from 'express';
import Property from '../models/Property';
import { PropertyFilters, GeoLocation } from '../types';
import { MapboxService } from '../services/MapboxService';

export class PropertyController {
    // Create a new property listing
    static async createProperty(req: Request, res: Response): Promise<void> {

        // console.log('JASDJFAJSDF', req.body);
        try {
            const propertyData = req.body;

            // Geocode the address if coordinates are not provided
            if (propertyData.address && !propertyData.location) {

                console.log('MJSJSUUSU',propertyData.address);

                const geoLocation = await MapboxService.geocodeAddress(propertyData.address);
                if (geoLocation) {
                    propertyData.location = geoLocation;
                }
            }

            const property = new Property(propertyData);
            await property.save();

            res.status(201).json({
                success: true,
                data: property
            });
        } catch (error) {
            console.error('Error creating property:', error);
            res.status(500).json({
                success: false,
                error: 'Server Error'
            });
        }
    }

    // Get all properties with filtering, sorting and pagination
    static async getProperties(req: Request, res: Response): Promise<void> {
        try {
            const filters = req.query as unknown as PropertyFilters;
            const query: any = {};

            // Apply filters
            if (filters.propertyType?.length) {
                query.propertyType = { $in: filters.propertyType };
            }

            if (filters.listingType) {
                query.listingType = filters.listingType;
            }

            if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
                query.price = {};
                if (filters.minPrice !== undefined) {
                    query.price.$gte = filters.minPrice;
                }
                if (filters.maxPrice !== undefined) {
                    query.price.$lte = filters.maxPrice;
                }
            }

            if (filters.minBedrooms !== undefined) {
                query.bedrooms = { $gte: filters.minBedrooms };
            }

            if (filters.minBathrooms !== undefined) {
                query.bathrooms = { $gte: filters.minBathrooms };
            }

            if (filters.minArea !== undefined || filters.maxArea !== undefined) {
                query.area = {};
                if (filters.minArea !== undefined) {
                    query.area.$gte = filters.minArea;
                }
                if (filters.maxArea !== undefined) {
                    query.area.$lte = filters.maxArea;
                }
            }

            if (filters.amenities?.length) {
                query.amenities = { $all: filters.amenities };
            }

            // Text search
            if (filters.keywords) {
                query.$text = { $search: filters.keywords };
            }

            // Geographic search
            if (filters.bounds) {
                query.location = {
                    $geoWithin: {
                        $box: [
                            filters.bounds.sw, // [longitude, latitude] of southwest corner
                            filters.bounds.ne  // [longitude, latitude] of northeast corner
                        ]
                    }
                };
            }

            // Ensure we only show published properties
            query.isPublished = true;

            // Pagination
            const page = filters.page || 1;
            const limit = filters.limit || 10;
            const skip = (page - 1) * limit;

            // Sorting
            const sortOptions: any = {};
            if (filters.sortBy) {
                sortOptions[filters.sortBy] = filters.sortOrder === 'desc' ? -1 : 1;
            } else {
                // Default sort by newest first
                sortOptions.createdAt = -1;
            }

            const properties = await Property.find(query)
                .sort(sortOptions)
                .skip(skip)
                .limit(limit)
                .populate('agent', 'name email');

            const total = await Property.countDocuments(query);

            res.status(200).json({
                success: true,
                count: properties.length,
                total,
                pagination: {
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit)
                },
                data: properties
            });
        } catch (error) {
            console.error('Error fetching properties:', error);
            res.status(500).json({
                success: false,
                error: 'Server Error'
            });
        }
    }

    // Get property by ID
    static async getPropertyById(req: Request, res: Response): Promise<void> {
        try {
            const property = await Property.findById(req.params.id)
                .populate('agent', 'name email');

            if (!property) {
                res.status(404).json({
                    success: false,
                    error: 'Property not found'
                });
                return;
            }

            res.status(200).json({
                success: true,
                data: property
            });
        } catch (error) {
            console.error('Error fetching property:', error);
            res.status(500).json({
                success: false,
                error: 'Server Error'
            });
        }
    }

    // Update property
    static async updateProperty(req: Request, res: Response): Promise<void> {
        try {
            const propertyData = req.body;

            // Geocode the address if it has been updated
            if (propertyData.address) {
                const geoLocation = await MapboxService.geocodeAddress(propertyData.address);
                if (geoLocation) {
                    propertyData.location = geoLocation;
                }
            }

            const property = await Property.findByIdAndUpdate(
                req.params.id,
                propertyData,
                { new: true, runValidators: true }
            );

            if (!property) {
                res.status(404).json({
                    success: false,
                    error: 'Property not found'
                });
                return;
            }

            res.status(200).json({
                success: true,
                data: property
            });
        } catch (error) {
            console.error('Error updating property:', error);
            res.status(500).json({
                success: false,
                error: 'Server Error'
            });
        }
    }

    // Delete property
    static async deleteProperty(req: Request, res: Response): Promise<void> {
        try {
            const property = await Property.findByIdAndDelete(req.params.id);

            if (!property) {
                res.status(404).json({
                    success: false,
                    error: 'Property not found'
                });
                return;
            }

            res.status(200).json({
                success: true,
                data: {}
            });
        } catch (error) {
            console.error('Error deleting property:', error);
            res.status(500).json({
                success: false,
                error: 'Server Error'
            });
        }
    }

    // Search properties by proximity to a location
    static async searchPropertiesByProximity(req: Request, res: Response): Promise<void> {
        try {
            const { longitude, latitude, maxDistance } = req.query;

            if (!longitude || !latitude) {
                res.status(400).json({
                    success: false,
                    error: 'Longitude and latitude are required'
                });
                return;
            }

            // Convert parameters to numbers
            const lng = parseFloat(longitude as string);
            const lat = parseFloat(latitude as string);

            // Default to 10km if not specified
            const distance = maxDistance ? parseFloat(maxDistance as string) : 10000;

            const properties = await Property.find({
                location: {
                    $near: {
                        $geometry: {
                            type: 'Point',
                            coordinates: [lng, lat]
                        },
                        $maxDistance: distance
                    }
                },
                isPublished: true
            }).populate('agent', 'name email');

            res.status(200).json({
                success: true,
                count: properties.length,
                data: properties
            });
        } catch (error) {
            console.error('Error searching properties by proximity:', error);
            res.status(500).json({
                success: false,
                error: 'Server Error'
            });
        }
    }
}