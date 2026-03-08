import type {Payload} from "./../../../core/data/remote/apiResponseStructure.ts";
import type {Route, Stop} from "../model/queryable.ts";

export interface GetQueryablesObj extends Payload {
    stops: Stop[],
    routes: Route[]
}