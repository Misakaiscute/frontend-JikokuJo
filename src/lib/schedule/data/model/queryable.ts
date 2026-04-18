export type Stop = {
    kind: "stop",
    ids: string[],
    name: string,
}

export type Route = {
    kind: "route",
    id: string,
    short_name: string,
    type: number,
    color: string | null,
}

export const getRouteDesignation: Map<number, string> = Object.freeze(new Map<number, string>([
    [1, "busz"], [2, "villamos"],
    [3, "metró"], [4, "troli"],
    [5, "vonat"], [6, "hév"],
    [7, "taxi"], [8, "egyéb"]
]));

export type Queryable = Stop | Route