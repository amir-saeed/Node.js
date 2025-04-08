export interface GeoLocation {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
}

export interface PropertyFeature {
    name: string;
    value: string | number | boolean;
}

export interface PropertyImage {
    url: string;
    caption?: string;
    isPrimary?: boolean;
}

export interface PropertyAddress {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    formatted?: string;
}

export enum PropertyType {
    HOUSE = 'house',
    APARTMENT = 'apartment',
    CONDO = 'condo',
    TOWNHOUSE = 'townhouse',
    LAND = 'land',
    COMMERCIAL = 'commercial'
}

export enum ListingType {
    SALE = 'sale',
    RENT = 'rent'
}

export interface PropertyFilters {
    propertyType?: PropertyType[];
    listingType?: ListingType;
    minPrice?: number;
    maxPrice?: number;
    minBedrooms?: number;
    minBathrooms?: number;
    minArea?: number;
    maxArea?: number;
    amenities?: string[];
    keywords?: string;
    bounds?: {
        sw: [number, number]; // [longitude, latitude] of southwest corner
        ne: [number, number]; // [longitude, latitude] of northeast corner
    };
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
}