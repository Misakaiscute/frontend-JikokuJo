export type Stop = {
    kind: "stop",
    ids: string[],
    name: string,
}

export type Route = {
    kind: "route",
    route_id: string,
    route_short_name: string,
    type: number,
    color: string | null,
}

export type Queryable = Stop | Route