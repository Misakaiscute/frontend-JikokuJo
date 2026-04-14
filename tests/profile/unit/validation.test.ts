import {describe, expect, it} from "vitest";
import AccountInfoValidator from "../../../src/lib/profile/utils/validator.ts";

const validator: AccountInfoValidator = new AccountInfoValidator()

describe("Account info validator", () => {
    describe("Email validation", () => {
        it("should return true on valid email", () => {
            expect(validator.validateEmail("john.doe@gmail.com")).toBe(true);
            expect(validator.validateEmail("bigboss@bigcorp.dev")).toBe(true);
            expect(validator.validateEmail("asd@asd.hu")).toBe(true);
        });
        it("should return false on invalid email", () => {
            expect(validator.validateEmail("john.com")).toBe(false);
            expect(validator.validateEmail("john@ihatet3theo")).toBe(false);
            expect(validator.validateEmail("nodotnoat")).toBe(false);
        });
    });
    describe("Password validation", () => {
        it("should return true when password is 8 or more characters", () => {
            expect(validator.validatePassword("12345678")).toBe(true);
            expect(validator.validatePassword("uzcdtfzguhiougzfdrcfz")).toBe(true);
        });
        it("should return false when password is less than 8 characters", () => {
            expect(validator.validatePassword("1234567")).toBe(false);
            expect(validator.validatePassword("")).toBe(false);
        });
    });
});