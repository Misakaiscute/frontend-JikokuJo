export interface Stop{
    kind: "stop",
    ids: string[],
    name: string,
}

export interface Route{
    kind: "route",
    route_id: string,
    route_short_name: string,
    type: number,
    color: string,
}

export type Queryable = Stop | Route