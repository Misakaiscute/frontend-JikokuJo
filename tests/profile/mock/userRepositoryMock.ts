import type { Favourite } from "../../../src/lib/profile/data/model/favourite.ts";
import type { User } from "../../../src/lib/profile/data/model/user.ts";
import type { ToggleFavouriteObj } from "../../../src/lib/profile/data/remote/ApiResponseStructure.ts";
import type UserRepository from "../../../src/lib/profile/data/repository/userRepository.ts";

export default class UserRepositoryMock implements UserRepository {
    public mockLoginSuccess: boolean = true;
    public mockRegisterSuccess: boolean = false;
    
    public mockFavourites: Favourite[] = [];
    constructor() {
        for(let i = 1; i <= 26; i++){
            this.mockFavourites.push({
                route: {
                    kind: "route",
                    id: i.toString(),
                    short_name: `Route No. ${i}`,
                    color: "000000",
                    type: 2
                },
                time: i
            });
        }
    }

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
    toggleFavourite(routeId: string, atMins: number): Promise<ToggleFavouriteObj> {
        const index: number = this.mockFavourites.findIndex((it: Favourite) => {
            return it.route.id === routeId && it.time === atMins
        });
        if (index >= 0){
            const deletedFav: Favourite = this.mockFavourites[index];
            this.mockFavourites = this.mockFavourites.splice(index, 1);
            return Promise.resolve({
                route: {
                    kind: "route",
                    id: deletedFav.route.id,
                    short_name: deletedFav.route.short_name,
                    color: deletedFav.route.color,
                    type: deletedFav.route.type
                },
                new_status: false
            });
        } else {
            return Promise.reject("Adding new elements is not supported in tests.");
        };
    }
    getFavourites(): Promise<Favourite[] | null> {
        return Promise.resolve(this.mockFavourites);
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
