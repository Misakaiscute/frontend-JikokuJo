import type {Payload} from "../../../core/data/remote/apiResponseStructure.ts";
import type { Route } from "../../../schedule/data/model/queryable.ts";
import type {Favourite} from "../model/favourite.ts";
import type {User} from "../model/user.ts";

export interface LoginObj extends Payload {}

export interface GetFavouritesObj extends Payload {
    favourites: Favourite[]
}

export interface ToggleFavouriteObj extends Payload {
    route: Route,
    new_status: boolean
}

export interface GetUserObj extends Payload {
    user: User
}