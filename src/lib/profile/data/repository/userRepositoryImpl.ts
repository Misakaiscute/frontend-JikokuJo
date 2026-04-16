import type UserRepository from "./userRepository.ts";
import axios, {type AxiosError} from "axios";
import type {RootResponse} from "../../../core/data/remote/apiResponseStructure.ts";
import type {GetFavouritesObj, GetUserObj, ToggleFavouriteObj} from "../remote/ApiResponseStructure.ts";
import type {User} from "../model/user.ts";
import type {Favourite} from "../model/favourite.ts";
import { timeFormatter } from "../../../core/utils/timeFormatter.ts";

export default class UserRepositoryImpl implements UserRepository {
    check = async (): Promise<void> => {
        return await axios.get("/api/user")
            .then(() => { return; })
            .catch(() => { throw new Error("Felhasználó nincs bejelentkezve."); });
    }
    login = async (email: string, password: string, rememberMe: boolean): Promise<void> => {
        await axios.get("/sanctum/csrf-cookie");
        return await axios.post<RootResponse<any>>(`/api/user/login`, {
            email: email,
            password: password,
            remember_user: rememberMe
        }).then(() => {
            return;
        }).catch((err: AxiosError<RootResponse<any>>) => {
            if (err.response?.data?.errors === undefined) {
                throw new Error("Valami hiba történt.");
            } else {
                throw new Error(err.response?.data?.errors[0] ?? "Valami hiba történt.");
            }
        });
    }
    register = async (firstName: string, lastName: string, email: string, password: string, passwordConfirmation: string): Promise<void> => {
        return await axios.post<RootResponse<any>>("/api/user/register", {
            first_name: firstName,
            second_name: lastName,
            email: email,
            password: password,
            password_confirmation: passwordConfirmation
        }).then(() => {
            return;
        }).catch((err: AxiosError<RootResponse<any>>) => {
            if (err.response?.data?.errors === undefined) {
                throw new Error("Valami hiba történt.");
            } else {
                throw new Error(err.response?.data?.errors[0] ?? "Valami hiba történt.");
            }
        });
    }
    logout = async (): Promise<void> => {
        await this.check().catch((err: Error) => {
            throw new Error(err.message);
        });
        return await axios.post("/api/user/logout").then(() => {
            return;
        })
        .catch(() => {
            throw new Error("Szerver oldali hiba.");
        });
    }
    getFavourites = async (): Promise<Favourite[] | null> => {
        await this.check().catch((err: Error) => {
            throw new Error(err.message);
        });
        return await axios.get<RootResponse<GetFavouritesObj>>("/api/user/favourites")
            .then((res) => {
                return res.data.data.favourites;
            }).catch((err: AxiosError<RootResponse<any>>) => {
                throw new Error(err.response?.data.errors[0] ?? "Valami hiba történt");
            });
    }
    toggleFavourite = async (routeId: string, atMins: number): Promise<ToggleFavouriteObj> => {
        await this.check().catch((err: Error) => {
            throw new Error(err.message);
        });
        return await axios.post<RootResponse<ToggleFavouriteObj>>("/api/routes/favourite/toggle", {
            time: atMins,
            route_id: routeId
        }).then((res) => {
            return res.data.data;
        }).catch((err: AxiosError<RootResponse<any>>) => {
            if (err.response?.data?.errors === undefined) {
                throw new Error("Valami hiba történt.");
            } else {
                throw new Error(err.response?.data?.errors[0] ?? "Valami hiba történt.");
            }
        });
    }
    getUser = async (): Promise<User> => {
        await this.check().catch((err: Error) => {
            throw new Error(err.message);
        });
        return await axios.get<RootResponse<GetUserObj>>("/api/user")
            .then((res) => {
                return res.data.data.user;
            }).catch(() => {
                throw new Error("Felhasználó nincs bejelentkezve.");
            });
    }
}