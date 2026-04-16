import type {Favourite} from "../model/favourite.ts";
import type {User} from "../model/user.ts";
import type { ToggleFavouriteObj } from "../remote/ApiResponseStructure.ts";

export default interface UserRepository{
    check(): Promise<void>
    login(email: string, password: string, rememberMe: boolean): Promise<void>;
    register(firstName: string, lastName: string, email: string, password: string, passwordConfirmation: string): Promise<void>;
    logout(): Promise<void>
    getFavourites(): Promise<Favourite[] | null>;
    toggleFavourite(routeId: string, atMins: number): Promise<ToggleFavouriteObj>
    getUser(): Promise<User>;
}