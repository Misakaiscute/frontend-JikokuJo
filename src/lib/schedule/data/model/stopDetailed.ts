import { type Location } from "./location.ts";

export type StopDetailed = {
    id: string,
    name: string,
    location: Location,
    arrival_time: number,
    order: number
}