import type { Favourite } from "../../../src/lib/profile/data/model/favourite.ts";
import type { User } from "../../../src/lib/profile/data/model/user.ts";
import type { ToggleFavouriteObj } from "../../../src/lib/profile/data/remote/ApiResponseStructure.ts";
import type UserRepository from "../../../src/lib/profile/data/repository/userRepository.ts";

export default class UserRepositoryMock implements UserRepository {
    public mockLoginSuccess: boolean = true;
    public mockRegisterSuccess: boolean = false;

    check(): Promise<void> {
        return Promise.resolve();
    }
    login(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.mockLoginSuccess){
                resolve();
            } else {
                reject(new Error("Error triggered"));
            }
        });
    }
    register(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.mockRegisterSuccess){
                resolve();
            } else {
                reject(new Error("Error triggered"));
            }
        });
    }
    logout(): Promise<void> {
        return Promise.resolve();
    }
    toggleFavourite(): Promise<ToggleFavouriteObj> {
        return Promise.resolve();
    }
    getFavourites(): Promise<Favourite[] | null> {
        return Promise.resolve([]);
    }
    getUser(): Promise<User> {
        return Promise.resolve({
            id: 1,
            first_name: "John",
            second_name: "Doe",
            email: "john.doe@gmail.com",
        });
    }
}
