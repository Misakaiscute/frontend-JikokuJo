export type VehiclePositionUpdate = {
    trip_id: string,
    lat: number,
    lon: number,
    speed: number,
    brearing: number,
    updatedAt: Date,
    message: string
}