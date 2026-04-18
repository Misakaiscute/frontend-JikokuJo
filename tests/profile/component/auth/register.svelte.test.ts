import {beforeEach, describe, expect, it} from "vitest";
import UserRepositoryMock from "../../mock/userRepositoryMock.ts";
import Component from "../../../../src/lib/profile/presentation/auth/Register.svelte";
import {fireEvent, render, screen} from "@testing-library/svelte";
import UserController from "../../../../src/lib/profile/presentation/userController.svelte.ts";
import {tick} from "svelte";

describe("Register component", () => {
    let container!: HTMLElement;
    let userController!: UserController;
    const userRepository = new UserRepositoryMock();

    beforeEach(async () => {
        const context = new Map([[UserController.KEY, new UserController(userRepository)]]);
        ({ container } = render(Component, {
            context: context,
        }));
        userController = context.get(UserController.KEY) as UserController;
        userController.isLoggedIn.catch(() => {});
        await tick();
    });

    it("should show inputs when its promise is resolved, register button not yet been clicked", async () => {
        userController.registerRequestResult = Promise.resolve(false);
        const inputs: NodeListOf<HTMLElement> = container.querySelectorAll("input");
        expect(inputs.length).toBe(5);
        inputs.forEach((input: HTMLElement) => expect(input).toBeInTheDocument());
    });
    it("should show loader when its promise is resolving", async () => {
        userController.registerRequestResult = new Promise(() => {});
        await tick();

        const loadingSpinner: HTMLElement | null = container.querySelector("#loader");
        expect(loadingSpinner).toBeInTheDocument();
    });

    it("should display validator error when form sending errors out", async () => {
        userRepository.mockRegisterSuccess = true;
        const registerBtn: HTMLElement | null = container.querySelector("#submit");
        registerBtn?.click();

        await userController.registerRequestResult.catch(() => {});
        await tick();

        const errorMsg = container.querySelector("#error-msg");
        expect(errorMsg).toBeInTheDocument();
    });
    it("should display network/repository error when form sending errors out", async () => {
        userRepository.mockRegisterSuccess = false;
        await fireEvent.input(container.querySelector("#last-name")!, { target: { value: "Test" } });
        await fireEvent.input(container.querySelector("#first-name")!, { target: { value: "Elek" } });
        await fireEvent.input(container.querySelector("#email")!, { target: { value: "tesztelek@gmail.com" } });
        await fireEvent.input(container.querySelector("#password")!, { target: { value: "password123" } });
        await fireEvent.input(container.querySelector("#password-confirm")!, { target: { value: "password123" } });
        const registerBtn: HTMLElement | null = container.querySelector("#submit");
        registerBtn?.click();

        await userController.registerRequestResult.catch(() => {});
        await tick();

        const errorMsg = container.querySelector("#error-msg");
        expect(errorMsg).toBeInTheDocument();
    });
    it("should display success message when form sending succeeds", async () => {
        userRepository.mockRegisterSuccess = true;
        await fireEvent.input(container.querySelector("#last-name")!, { target: { value: 'Test' } });
        await fireEvent.input(container.querySelector("#first-name")!, { target: { value: 'Elek' } });
        await fireEvent.input(container.querySelector("#email")!, { target: { value: 'tesztelek@gmail.com' } });
        await fireEvent.input(container.querySelector("#password")!, { target: { value: 'password123' } });
        await fireEvent.input(container.querySelector("#password-confirm")!, { target: { value: 'password123' } });
        const registerBtn: HTMLElement | null = container.querySelector("#submit");
        registerBtn?.click();

        await userController.registerRequestResult.finally(async () => {
            await tick();
            const successMsg: HTMLElement | null = container.querySelector("#success-msg");
            expect(successMsg).toBeInTheDocument();
        });
    });
});