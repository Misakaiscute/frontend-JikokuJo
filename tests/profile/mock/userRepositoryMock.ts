import type UserRepository from "../../../src/lib/profile/data/repository/userRepository.ts";

export default class UserRepositoryMock implements UserRepository {
    public userLoggedIn: boolean = false;
    public mockLoginSuccess: boolean = true;
    public mockRegisterSuccess: boolean = false;

    check(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.userLoggedIn){
                resolve();
            } else {
                reject(new Error("User logged out"));
            }
        });
    }
    login(email: string, password: string, rememberMe: boolean): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.mockLoginSuccess){
                resolve();
            } else {
                reject(new Error("Error triggered"));
            }
        });
    }
    register(firstName: string, lastName: string, email: string, password: string, passwordConfirmation: string): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.mockRegisterSuccess){
                resolve();
            } else {
                reject(new Error("Error triggered"));
            }
        });
    }
}