import {describe, expect, it} from "vitest";
import UserRepositoryMock from "../mock/userRepositoryMock.ts";
import Component from "../../../src/lib/profile/presentation/Login.svelte";
import {fireEvent, render, screen} from "@testing-library/svelte";
import UserController from "../../../src/lib/profile/presentation/userController.svelte.ts";
import {tick} from "svelte";

describe("Login component", () => {
    const userRepository = new UserRepositoryMock();
    userRepository.userLoggedIn = false;
    it("should show inputs when its promise is resolved, login button not yet been clicked", async () => {
        const context = new Map([[UserController.KEY, new UserController(userRepository)]]);
        const { container } = render(Component, {
            context: context,
        });
        const userController: UserController = context.get(UserController.KEY) as UserController;
        userController.isLoggedIn.catch(() => {});

        userController.loginRequestResult = Promise.resolve(false);
        const inputs: NodeListOf<HTMLElement> = container.querySelectorAll("input");
        expect(inputs.length).toBe(3);
        inputs.forEach((input: HTMLElement) => expect(input).toBeInTheDocument());
    });
    it("should show loader when its promise is resolving", async () => {
        const context = new Map([[UserController.KEY, new UserController(userRepository)]]);
        const { container } = render(Component, {
            context: context,
        });
        const userController: UserController = context.get(UserController.KEY) as UserController;
        userController.isLoggedIn.catch(() => {});

        userController.loginRequestResult = new Promise(() => {});
        const loadingSpinner: HTMLElement | null = container.querySelector("#loader");
        expect(loadingSpinner).toBeInTheDocument();
    });

    it("should display validator error when form sending errors out", async () => {
        const context = new Map([[UserController.KEY, new UserController(userRepository)]]);
        const { container } = render(Component, {
            context: context
        });
        const userController: UserController = context.get(UserController.KEY) as UserController;
        userController.isLoggedIn.catch(() => {});
        await tick();

        userRepository.mockLoginSuccess = true;
        const loginBtn: HTMLElement | null = container.querySelector("#submit");
        loginBtn?.click();

        await userController.loginRequestResult.catch(() => {});
        await tick();

        const errorMsg = container.querySelector("#error-msg");
        expect(errorMsg).toBeInTheDocument();
    });
    it("should display network/repository error when form sending errors out", async () => {
        const context = new Map([[UserController.KEY, new UserController(userRepository)]]);
        const { container } = render(Component, {
            context: context
        });
        const userController: UserController = context.get(UserController.KEY) as UserController;
        userController.isLoggedIn.catch(() => {});
        await tick();

        userRepository.mockLoginSuccess = false;
        await fireEvent.input(container.querySelector("#email")!, { target: { value: "tesztelek@gmail.com" } });
        await fireEvent.input(container.querySelector("#password")!, { target: { value: "password123" } });
        const loginBtn: HTMLElement | null = container.querySelector("#submit");
        loginBtn?.click();

        await userController.loginRequestResult.catch(() => {});
        await tick();

        const errorMsg = container.querySelector("#error-msg");
        expect(errorMsg).toBeInTheDocument();
    });
    it("should display success message when form sending succeeds", async () => {
        const context = new Map([[UserController.KEY, new UserController(userRepository)]]);
        const { container } = render(Component, {
            context: context,
        });
        const userController: UserController = context.get(UserController.KEY) as UserController;
        userController.isLoggedIn.catch(() => {});

        userRepository.mockLoginSuccess = true;
        await fireEvent.input(container.querySelector("#email")!, { target: { value: 'tesztelek@gmail.com' } });
        await fireEvent.input(container.querySelector("#password")!, { target: { value: 'password123' } });
        const loginBtn: HTMLElement | null = container.querySelector("#submit");
        loginBtn?.click();

        await userController.loginRequestResult.finally(async () => {
            await tick();
            const successMsg: HTMLElement | null = container.querySelector("#success-msg");
            expect(successMsg).toBeInTheDocument();
        });
    });
});