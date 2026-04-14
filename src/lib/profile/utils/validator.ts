export default class AccountInfoValidator {
    validateEmail = (email: string): boolean => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    validatePassword = (password: string): boolean => {
        return password.length >= 8
    }
}
