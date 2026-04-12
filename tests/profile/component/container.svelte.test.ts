import {describe, expect, it} from "vitest";
import UserController from "../../../src/lib/profile/presentation/userController.svelte.ts";
import UserRepositoryMock from "../mock/userRepositoryMock.ts";
import {render, screen} from "@testing-library/svelte";
import Component from "../../../src/lib/profile/presentation/Container.svelte";

describe("User container actions component", () => {
    const userRepository = new UserRepositoryMock();
    it("should have login and register button when no user found", async () => {
        userRepository.userLoggedIn = false;
        render(Component, {
            context: new Map([[UserController.KEY, new UserController(userRepository)]]),
        });

        const loginButton: HTMLElement = await screen.findByRole("button", { name: "Bejelentkezés" });
        const registerButton: HTMLElement = await screen.findByRole("button", { name: "Regisztráció" });

        expect(loginButton).toBeInTheDocument();
        expect(registerButton).toBeInTheDocument();
    });
    it("should open login form on login button click", async () => {
        userRepository.userLoggedIn = false;
        render(Component, {
            context: new Map([[UserController.KEY, new UserController(userRepository)]]),
        });

        const loginButton: HTMLElement = await screen.findByRole("button", { name: "Bejelentkezés" });
        loginButton.click();
        const loginPanelCloseBtn: HTMLElement = await screen.findByLabelText("close-panel");
        expect(loginPanelCloseBtn).toBeInTheDocument();
    });
    it("should open register form on register button click", async () => {
        userRepository.userLoggedIn = false;
        render(Component, {
            context: new Map([[UserController.KEY, new UserController(userRepository)]]),
        });

        const registerButton: HTMLElement = await screen.findByRole("button", { name: "Regisztráció" });
        registerButton.click();
        const registerPanelCloseBtn: HTMLElement = await screen.findByLabelText("close-panel");
        expect(registerPanelCloseBtn).toBeInTheDocument();
    });
});
