import {describe, it, expect, beforeEach, vi} from "vitest";
import Component from "../../../../src/lib/schedule/presentation/DropdownExpanderArrow.svelte";
import ScheduleSearchController from "../../../../src/lib/schedule/presentation/scheduleSearchController.svelte.ts";
import TripSelectionController from "../../../../src/lib/schedule/presentation/tripSelectionController.svelte.ts";
import ActionController from "../../../../src/lib/schedule/presentation/actionController.svelte.ts";
import QueryableRepositoryMock from "../../mock/queryableRepositoryMock.ts";
import TripsRepositoryMock from "../../mock/tripsRepositoryMock.ts";
import {render} from "@testing-library/svelte";
import {tick} from "svelte";
import type {Queryable} from "../../../../src/lib/schedule/data/model/queryable.ts";

describe("Dropdown expander arrow component", () => {
    let container!: HTMLElement;
    let scheduleSearchController!: ScheduleSearchController;
    let tripSelectionController!: TripSelectionController;
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
            )]
        ]);
        ({container} = render(Component, {
            context: context
        }));
        scheduleSearchController = context.get(ScheduleSearchController.KEY) as ScheduleSearchController;
        tripSelectionController = context.get(TripSelectionController.KEY) as TripSelectionController;
        actionController = context.get(ActionController.KEY) as ActionController;

        queryablesRepository.mockGetQueryablesSuccess = true;
        tripsRepository.mockGetTripsSuccess = true;
        await tick();
    });
    describe("For queryables", () => {
        it("should show when search string is not empty", async () => {
            actionController.currAction = "queryableSearch";
            await tick();

            vi.useFakeTimers();
            scheduleSearchController.searchString = "1";
            vi.runAllTimers();
            await vi.runAllTimersAsync();
            await tick();
            vi.useRealTimers();

            expect(container.querySelector("#expand-btn")).toBeInTheDocument();
        });
        it("should not show when search string is empty", async () => {
            actionController.currAction = "queryableSearch";
            await tick();

            expect(container.querySelector("#expand-btn")).not.toBeInTheDocument();
        });
    });
    describe("For trips", () => {
        it("should show when trips available", async () => {
            actionController.currAction = "tripSelection";
            await tick();
            const queryables: Queryable[] = await queryablesRepository.getQueryables();
            tripSelectionController.searchTrips(queryables[0], new Date(Date.now()));

            tripSelectionController.tripSelectRequestResult.finally(async () => {
                await tick();
                expect(container.querySelector("#expand-btn")).toBeInTheDocument();
            })
        });
        it("should not show when trips not available", async () => {
            actionController.currAction = "tripSelection";
            await tick();

            expect(container.querySelector("#expand-btn")).not.toBeInTheDocument();
        });
    });
});