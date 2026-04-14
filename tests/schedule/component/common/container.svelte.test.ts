import {describe, it, expect, beforeEach, vi} from "vitest";
import Component from "../../../../src/lib/schedule/presentation/Container.svelte";
import ActionController from "../../../../src/lib/schedule/presentation/actionController.svelte.ts";
import ScheduleSearchController from "../../../../src/lib/schedule/presentation/scheduleSearchController.svelte.ts";
import TripSelectionController from "../../../../src/lib/schedule/presentation/tripSelectionController.svelte.ts";
import QueryableRepositoryMock from "../../mock/queryableRepositoryMock.ts";
import TripsRepositoryMock from "../../mock/tripsRepositoryMock.ts";
import {fireEvent, render} from "@testing-library/svelte";
import {tick} from "svelte";

describe("Schedule and trip concerned container component", () => {
    let container!: HTMLElement;
    let actionController!: ActionController;
    const queryablesRepository: QueryableRepositoryMock = new QueryableRepositoryMock();
    const tripsRepository: TripsRepositoryMock = new TripsRepositoryMock();

    beforeEach(async () => {
        const context = new Map<symbol, unknown>([
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
        await tick();
    });

    it("should queryable actions when action in queryableSearch", async () => {
        actionController.currAction = "queryableSearch";
        await tick();

        expect(container.querySelector("#queryable-action"));
    });
    it("should complete workflow when action is trip selection", async () => {
        actionController.currAction = "tripSelection";
        await tick();

        expect(container.querySelector("#trip-action"));
    });
});