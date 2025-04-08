import { geocodingService } from '../config/mapbox';
import { PropertyAddress, GeoLocation } from '../types';

export class MapboxService {
    // Geocode an address to get coordinates
    static async geocodeAddress(address: PropertyAddress): Promise<GeoLocation | null> {
        try {
            const query = `${address.street}, ${address.city}, ${address.state} ${address.zipCode}, ${address.country}`;

            const response = await geocodingService.forwardGeocode({
                query,
                limit: 1
            }).send();

            if (response.body.features && response.body.features.length > 0) {
                const [longitude, latitude] = response.body.features[0].center;
                return {
                    type: 'Point',
                    coordinates: [longitude, latitude]
                };
            }

            return null;
        } catch (error) {
            console.error('Geocoding error:', error);
            return null;
        }
    }

    // Reverse geocode coordinates to get an address
    static async reverseGeocode(longitude: number, latitude: number): Promise<Partial<PropertyAddress> | null> {
        try {
            const response = await geocodingService.reverseGeocode({
                query: [longitude, latitude]
            }).send();

            if (response.body.features && response.body.features.length > 0) {
                const feature = response.body.features[0];
                const context = feature.context || [];

                // Extract address components
                const address: Partial<PropertyAddress> = {
                    formatted: feature.place_name
                };

                // Parse context to extract city, state, zipCode and country
                context.forEach((item: any) => {
                    if (item.id.startsWith('place')) {
                        address.city = item.text;
                    } else if (item.id.startsWith('region')) {
                        address.state = item.text;
                    } else if (item.id.startsWith('postcode')) {
                        address.zipCode = item.text;
                    } else if (item.id.startsWith('country')) {
                        address.country = item.text;
                    }
                });

                // Extract street address from place name
                const placeParts = feature.place_name.split(',');
                if (placeParts.length > 0) {
                    address.street = placeParts[0].trim();
                }

                return address;
            }

            return null;
        } catch (error) {
            console.error('Reverse geocoding error:', error);
            return null;
        }
    }
}