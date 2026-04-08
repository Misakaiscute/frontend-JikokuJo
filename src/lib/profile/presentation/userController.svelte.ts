import {getContext, setContext} from "svelte";
import type UserRepository from "../data/repository/userRepository.ts";
import UserRepositoryImpl from "../data/repository/userRepositoryImpl.ts";
import {validateEmail, validatePassword} from "../utils/validation.ts";

export default class UserController {
    private userRepository: UserRepository;
    private constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
        this.init();
    }
    private init = async (): Promise<void> => {
        this.isLoggedIn = new Promise(async (resolve, reject) => {
            await this.userRepository.check()
                .then(resolve)
                .catch(reject);
        });
    }
    public isLoggedIn: Promise<void> = $state(Promise.resolve());
    public popupShown: "login" | "register" | null = $state(null);

    public loginRequestResult: Promise<void> = $state(Promise.resolve());
    public attemptLogin = async (email: string, password: string, rememberMe: boolean): Promise<void> => {
        this.loginRequestResult = new Promise<void>(async (resolve, reject) => {
            if (!validateEmail(email)){
                reject(new Error("Adjon meg valós email címet."));
            } else if (!validatePassword(password)){
                reject(new Error("A jelszó legalább 8 karakter hosszú kell, hogy legyen."));
            } else {
                await this.userRepository.login(email, password, rememberMe)
                    .then(() => {
                        this.isLoggedIn = Promise.resolve();
                        resolve();
                    }).catch((err: Error) => {
                        reject(new Error(err.message));
                    });
            }
        });
    }

    public registerRequestResult: Promise<void> = $state(Promise.resolve());
    public attemptRegister = async (firstName: string, lastName: string, email: string, password: string, passwordConfirmation: string): Promise<void> => {
        this.registerRequestResult = new Promise<void>(async (resolve, reject) => {
            if (!validateEmail(email)){
                reject(new Error("Adjon meg valós email címet."));
            } else if (!validatePassword(password)){
                reject(new Error("A jelszó legalább 8 karakter hosszú kell, hogy legyen."));
            } else if (password !== passwordConfirmation) {
                reject(new Error("A két jelszó nem egyezik."));
            } else {
                await this.userRepository.register(firstName, lastName, email, password, passwordConfirmation)
                    .then(() => {
                        resolve();
                    }).catch((err: Error) => {
                        reject(new Error(err.message));
                    });
            }
        });
    }

    private static readonly KEY: symbol = Symbol("USER_CONTROLLER_KEY");
    public static setUserControllerContext(): UserController {
        return setContext(this.KEY, new UserController(new UserRepositoryImpl()));
    }
    public static getUserControllerContext(){
        return getContext<ReturnType<typeof this.setUserControllerContext>>(this.KEY);
    }
}