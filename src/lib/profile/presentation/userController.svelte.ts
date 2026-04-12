import {getContext, setContext} from "svelte";
import type UserRepository from "../data/repository/userRepository.ts";
import AccountInfoValidator from "../utils/validator.ts";

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
    public popupShown: "login" | "register" | null = $state(null);

    public loginRequestResult: Promise<boolean> = $state(Promise.resolve(false));
    public attemptLogin = async (email: string, password: string, rememberMe: boolean): Promise<void> => {
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

    public registerRequestResult: Promise<boolean> = $state(Promise.resolve(false));
    public attemptRegister = async (firstName: string, lastName: string, email: string, password: string, passwordConfirmation: string): Promise<void> => {
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

    public static readonly KEY: symbol = Symbol("USER_CONTROLLER_KEY");
    public static setUserControllerContext = (userRepository: UserRepository): UserController => {
        return setContext(this.KEY, new UserController(userRepository));
    }
    public static getUserControllerContext = () => {
        return getContext<ReturnType<typeof this.setUserControllerContext>>(this.KEY);
    }
}