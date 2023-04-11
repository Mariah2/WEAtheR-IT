export default interface GeoLocationCityModel {
    admin1: string;
    admin2: string;
    admin2_id: number;
    country: string;
    country_code: number;
    latitude: number;
    longitude: number;
    name: string;
    timezone: string;
    isFavorite: boolean | undefined;
}