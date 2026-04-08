import type UserRepository from "./userRepository.ts";
import axios, {type AxiosError} from "axios";
import type {RootResponse} from "../../../core/data/remote/apiResponseStructure.ts";

export default class UserRepositoryImpl implements UserRepository {
    async check(): Promise<void> {
        try {
            return await axios.get("/api/user")
                .then(() => { return; })
                .catch(() => { throw new Error("Felhasználó nincs bejelentkezve."); });
        } catch {
            throw new Error("Szerver oldali hiba.");
        }
    }
    async login(email: string, password: string, rememberMe: boolean): Promise<void> {
        await axios.get("/sanctum/csrf-cookie");
        return await axios.post<RootResponse<any>>(`/api/user/login/${rememberMe}`, {
            email: email,
            password: password,
        })
            .then(() => { return; })
            .catch((err: AxiosError<RootResponse<any>>) => {
                if (err.response?.data?.errors.length == 0){
                    throw new Error(err.response?.data?.message ?? "Valami hiba történt.");
                } else {
                    throw new Error(err.response?.data?.errors[0] ?? "Valami hiba történt.");
                }
            });
    }

    async register(firstName: string, lastName: string, email: string, password: string, passwordConfirmation: string): Promise<void> {
        return await axios.post<RootResponse<any>>("/api/user/register", {
            first_name: firstName,
            second_name: lastName,
            email: email,
            password: password,
            password_confirmation: passwordConfirmation
        })
            .then(() => { return; })
            .catch((err: AxiosError<RootResponse<any>>) => {
                if (err.response?.data?.errors.length == 0){
                    throw new Error(err.response?.data?.message ?? "Valami hiba történt.");
                } else {
                    throw new Error(err.response?.data?.errors[0] ?? "Valami hiba történt.");
                }
            });
    }
}