import {beforeEach, describe, expect, it} from "vitest";
import UserController from "../../../src/lib/profile/presentation/userController.svelte.ts";
import UserRepositoryMock from "../mock/userRepositoryMock.ts";
import {render} from "@testing-library/svelte";
import Component from "../../../src/lib/profile/presentation/Container.svelte";
import {tick} from "svelte";

describe("User container actions component", () => {
    let container!: HTMLElement;
    let userController!: UserController;

    beforeEach(async () => {
        const userRepository = new UserRepositoryMock();
        const context = new Map([[UserController.KEY, new UserController(userRepository)]]);
        ({ container } = render(Component, {
            context: context
        }));
        userController = context.get(UserController.KEY) as UserController;
        await tick();
    });

    it("should have an account button when user found", async () => {
        const accountBtn: HTMLElement | null = container.querySelector("#account-btn");
        expect(accountBtn).toBeInTheDocument();
    });
    it("should have login and register button when no user found", async () => {
        userController.isLoggedIn = Promise.reject("User not logged in");
        await tick();

        const loginButton: HTMLElement | null = container.querySelector("#login-btn");
        expect(loginButton).toBeInTheDocument();
        const registerButton: HTMLElement | null = container.querySelector("#register-btn");
        expect(registerButton).toBeInTheDocument();
    });
    it("should open login form on login button click", async () => {
        userController.isLoggedIn = Promise.reject("User not logged in");
        await tick();

        const loginButton: HTMLElement | null = container.querySelector("#login-btn");
        loginButton?.click();
        await tick();

        const loginPanelCloseBtn: HTMLElement | null = container.querySelector("#close-btn");
        expect(loginPanelCloseBtn).toBeInTheDocument();
    });
    it("should open register form on register button click", async () => {
        userController.isLoggedIn = Promise.reject("User not logged in");
        await tick();

        const registerButton: HTMLElement | null = container.querySelector("#register-btn");
        registerButton?.click();
        await tick();

        const registerPanelCloseBtn: HTMLElement | null = container.querySelector("#close-btn");
        expect(registerPanelCloseBtn).toBeInTheDocument();
    });
});
