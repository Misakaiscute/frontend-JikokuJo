import { beforeEach, describe, expect, it } from "vitest";
import Component from "../../../../src/lib/profile/presentation/account/AccountPanel.svelte";
import UserController from "../../../../src/lib/profile/presentation/userController.svelte";
import UserRepositoryMock from "../../mock/userRepositoryMock";
import { render, screen } from "@testing-library/svelte";
import { tick } from "svelte";
import type { Favourite } from "../../../../src/lib/profile/data/model/favourite";

describe("Account panel component", () => {
    let container!: HTMLElement;
    let userController!: UserController;
    const userRepository: UserRepositoryMock = new UserRepositoryMock();

    beforeEach(async () => {
        const context = new Map([[UserController.KEY, new UserController(userRepository)]]);
        ({container} = render(Component, {
            context: context
        }));
        userController = context.get(UserController.KEY) as UserController;
        await tick();
    });

    it("should show loader while fetching the user", async () => {
        userController.getUserRequestResult = new Promise(() => {});
        await tick();

        expect(container.querySelector("#loader")).toBeInTheDocument();
    });
    it("should show a retry button fetching the user errors out", async () => {
        userController.getUserRequestResult = Promise.reject("Test error");
        await tick();

        expect(container.querySelector("#retry-btn")).toBeInTheDocument();
    });

    it("should have contents on successful fetch", () => {
        expect(container.querySelector("#account-details")).toBeInTheDocument();
        expect(container.querySelector("#favourites")).toBeInTheDocument();
        expect(container.querySelectorAll("#favourite-item").length).toBe(26);
        expect(container.querySelector("#logout-btn")).toBeInTheDocument();
    });
    it("should be able to delete a favourite successfully", async () => {
        const favouriteDeleteButtons: NodeListOf<HTMLElement> | null = container.querySelectorAll("#favourite-remove-btn");
        const deletedElement: Favourite = userController.favourites!![0];
        favouriteDeleteButtons[0]?.click();
        await tick();

        expect(container.querySelectorAll("#favourite-item").length).toBe(25);
        expect(screen.queryByText(deletedElement.route.short_name)).not.toBeInTheDocument();
    });
});