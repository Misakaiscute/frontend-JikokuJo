import { type StopDetailed } from "./stopDetailed.ts";

export type Trip = {
    id: string,
    headsign: string,
    route_id: string,
    shape_id: string,
    stops: StopDetailed[],
    wheelchair_accessible: number,
    bikes_allowed: number,
    direction_id: number
}