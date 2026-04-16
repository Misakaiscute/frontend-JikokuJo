import {getContext, setContext} from "svelte";
import type UserRepository from "../data/repository/userRepository.ts";
import AccountInfoValidator from "../utils/validator.ts";
import type {Favourite} from "../data/model/favourite.ts";
import type {User} from "../data/model/user.ts";
import type { ToggleFavouriteObj } from "../data/remote/ApiResponseStructure.ts";

export default class UserController {
    private userRepository: UserRepository;
    private validator: AccountInfoValidator = new AccountInfoValidator();
    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
        this.init();
    }
    private init = (): void => {
        this.isLoggedIn = new Promise(async (resolve, reject) => {
            await this.userRepository.check()
                .then(() => resolve())
                .catch((err: Error) => reject(new Error(err.message)));
        });
    }

    public isLoggedIn: Promise<void> = $state(Promise.resolve());
    public popupShown: "login" | "register" | "account" | null = $state(null);

    public loginRequestResult: Promise<boolean> = $state(Promise.resolve(false));
    public attemptLogin = (email: string, password: string, rememberMe: boolean): void => {
        this.loginRequestResult = new Promise(async (resolve, reject) => {
            if (!this.validator.validateEmail(email)){
                reject(new Error("Adjon meg valós email címet."));
            } else if (!this.validator.validatePassword(password)){
                reject(new Error("A jelszó legalább 8 karakter hosszú kell, hogy legyen."));
            } else {
                await this.userRepository.login(email, password, rememberMe)
                    .then(() => {
                        this.isLoggedIn = Promise.resolve();
                        resolve(true);
                    }).catch((err: Error) => {
                        reject(new Error(err.message));
                    });
            }
        });
    }
    public attemptLogout = async (): Promise<void> => {
        await this.userRepository.logout().then(() => {
            this.favourites = [];
            this.isLoggedIn = Promise.reject("Felhasználó nincs bejelentkezve.");
            this.favouritesRequestResult = Promise.reject("Felhasználó nincs bejelentkezve.")
            this.getUserRequestResult = Promise.reject("Felhasználó nincs bejelentkezve.")
            this.registerRequestResult = Promise.resolve(false);
            this.loginRequestResult = Promise.resolve(false);
            this.popupShown = null;
        });
    }

    public registerRequestResult: Promise<boolean> = $state(Promise.resolve(false));
    public attemptRegister = (firstName: string, lastName: string, email: string, password: string, passwordConfirmation: string): void => {
        this.registerRequestResult = new Promise(async (resolve, reject) => {
            if (!this.validator.validateEmail(email)){
                reject(new Error("Adjon meg valós email címet."));
            } else if (!this.validator.validatePassword(password)){
                reject(new Error("A jelszó legalább 8 karakter hosszú kell, hogy legyen."));
            } else if (password !== passwordConfirmation) {
                reject(new Error("A két jelszó nem egyezik."));
            } else {
                await this.userRepository.register(firstName, lastName, email, password, passwordConfirmation)
                    .then(() => {
                        resolve(true);
                    }).catch((err: Error) => {
                        reject(new Error(err.message));
                    });
            }
        });
    }

    public getUserRequestResult: Promise<User> = $state(new Promise(() => {}));
    public getUser = (): void => {
        this.getUserRequestResult = new Promise(async (resolve, reject) => {
            await this.userRepository.getUser().then((user: User) => {
                resolve(user);
            }).catch((err: Error) => {
                reject(new Error(err.message))
            });
        });
    }

    public favourites: Favourite[] | null = $state(null);
    public favouritesRequestResult: Promise<void> = $state(new Promise(() => {}));
    public getFavourites = (): void => {
        this.favouritesRequestResult = new Promise(async (resolve, reject) => {
            await this.userRepository.getFavourites().then((res: Favourite[] | null) => {
                this.favourites = res;
                resolve();
            }).catch((err: Error) => {
                reject(new Error(err.message));
            });
        });
    }

    public toggleFavourite = async (routeId: string, atMins: number): Promise<void> => {
        return new Promise(async (resolve, reject) => {
            await this.userRepository.toggleFavourite(routeId, atMins).then((res: ToggleFavouriteObj) => {
                if (res.new_status){
                    const newFavourite: Favourite = {
                        time: atMins,
                        route: res.route
                    }
                    this.favourites = [...this.favourites ?? [], newFavourite];
                } else {
                    this.favourites = this.favourites?.filter((fav: Favourite) => {
                        return fav.route.id !== res.route.id;
                    }) ?? [];
                }
                resolve();
            }).catch((err: Error) => {
                reject(new Error(err.message));
            });
        });
    }

    public static readonly KEY: symbol = Symbol("USER_CONTROLLER_KEY");
    public static setUserControllerContext = (userRepository: UserRepository): UserController => {
        return setContext(this.KEY, new UserController(userRepository));
    }
    public static getUserControllerContext = () => {
        return getContext<ReturnType<typeof this.setUserControllerContext>>(this.KEY);
    }
}