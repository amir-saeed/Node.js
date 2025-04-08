import { config } from './config';
import mapboxgl from 'mapbox-gl';
import MapboxClient from '@mapbox/mapbox-sdk';
import MapboxGeocoding from '@mapbox/mapbox-sdk/services/geocoding';

mapboxgl.accessToken = config.mapboxApiKey;

const baseClient = MapboxClient({ accessToken: config.mapboxApiKey });
export const geocodingService = MapboxGeocoding(baseClient);
