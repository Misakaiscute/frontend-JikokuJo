import {describe, it, expect, beforeEach, vi} from "vitest";
import Component from "../../../../src/lib/schedule/presentation/Container.svelte";
import ActionController from "../../../../src/lib/schedule/presentation/actionController.svelte.ts";
import ScheduleSearchController from "../../../../src/lib/schedule/presentation/scheduleSearchController.svelte.ts";
import TripSelectionController from "../../../../src/lib/schedule/presentation/tripSelectionController.svelte.ts";
import QueryableRepositoryMock from "../../mock/queryableRepositoryMock.ts";
import TripsRepositoryMock from "../../mock/tripsRepositoryMock.ts";
import UserRepositoryMock from "../../../profile/mock/userRepositoryMock.ts";
import {render} from "@testing-library/svelte";
import {tick} from "svelte";
import UserController from "../../../../src/lib/profile/presentation/userController.svelte.ts";

describe("Schedule and trip concerned container component", () => {
    let container!: HTMLElement;
    let actionController!: ActionController;
    let userController!: UserController;
    const queryablesRepository: QueryableRepositoryMock = new QueryableRepositoryMock();
    const tripsRepository: TripsRepositoryMock = new TripsRepositoryMock();
    const userRepository: UserRepositoryMock = new UserRepositoryMock();
    userRepository.userLoggedIn = true;

    beforeEach(async () => {
        const context = new Map<symbol, unknown>([
            [UserController.KEY, new UserController(userRepository)],
            [ScheduleSearchController.KEY, new ScheduleSearchController(queryablesRepository)],
            [TripSelectionController.KEY, new TripSelectionController(queryablesRepository, tripsRepository)],
            [ActionController.KEY, new ActionController(
                async () => {},
                async () => {},
                async () => {}
            )],
        ]);
        ({container} = render(Component, {
            context: context
        }));
        actionController = context.get(ActionController.KEY) as ActionController;
        userController = context.get(UserController.KEY) as UserController;
        userController.isLoggedIn.catch(() => {});
        await tick();
    });

    it("should show queryable actions when action in queryableSearch", async () => {
        actionController.currAction = "queryableSearch";
        await tick();

        expect(container.querySelector("#queryable-action"));
    });
    it("should show trip actions when action is tripSelection", async () => {
        actionController.currAction = "tripSelection";
        await tick();

        expect(container.querySelector("#trip-action"));
    });
});