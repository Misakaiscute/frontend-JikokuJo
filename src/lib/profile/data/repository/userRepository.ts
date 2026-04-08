export default interface UserRepository{
    check(): Promise<void>
    login(email: string, password: string, rememberMe: boolean): Promise<void>;
    register(firstName: string, lastName: string, email: string, password: string, passwordConfirmation: string): Promise<void>;
}