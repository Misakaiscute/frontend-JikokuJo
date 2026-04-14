import {describe, it, expect, beforeEach} from "vitest";
import QueryableRepositoryMock from "../../mock/queryableRepositoryMock.ts";
import TripsRepositoryMock from "../../mock/tripsRepositoryMock.ts";
import ScheduleSearchController from "../../../../src/lib/schedule/presentation/scheduleSearchController.svelte.ts";
import TripSelectionController from "../../../../src/lib/schedule/presentation/tripSelectionController.svelte.ts";
import {render, screen} from "@testing-library/svelte";
import Component from "../../../../src/lib/schedule/presentation/ActionSelector.svelte";
import {tick} from "svelte";
import type {Queryable} from "../../../../src/lib/schedule/data/model/queryable.ts";
import type {Trip} from "../../../../src/lib/schedule/data/model/trip.ts";

describe("Action selector component", () => {
    let container!: HTMLElement;
    let scheduleSearchController!: ScheduleSearchController;
    let tripSelectionController!: TripSelectionController;
    const queryablesRepository: QueryableRepositoryMock = new QueryableRepositoryMock();
    const tripsRepository: TripsRepositoryMock = new TripsRepositoryMock();

    beforeEach(async () => {
        const context = new Map<symbol, unknown>([
            [ScheduleSearchController.KEY, new ScheduleSearchController(queryablesRepository)],
            [TripSelectionController.KEY, new TripSelectionController(queryablesRepository, tripsRepository)],
        ]);
        ({container} = render(Component, {
            context: context
        }));
        tripSelectionController = context.get(TripSelectionController.KEY) as TripSelectionController;
        scheduleSearchController = context.get(ScheduleSearchController.KEY) as ScheduleSearchController;
        await tick();
    });

    it("should not show anything if there is nothing selected", async () => {
        scheduleSearchController.selectedQueryable = null;
        tripSelectionController.selectedTrip = null;
        await tick();

        const toQueryableActionBtn: HTMLElement | null = container.querySelector("#to-queryable-action");
        expect(toQueryableActionBtn).not.toBeInTheDocument();
        const toTripActionBtn: HTMLElement | null = container.querySelector("#to-trip-action");
        expect(toTripActionBtn).not.toBeInTheDocument();
    });
    it("should only show queryable action button if queryable is selected but trip is not selected", async () => {
        queryablesRepository.mockGetQueryablesSuccess = true;
        const queryables: Queryable[] = await queryablesRepository.getQueryables();
        scheduleSearchController.selectedQueryable = queryables.filter((it: Queryable) => it.kind === "stop")[0];
        tripSelectionController.selectedTrip = null;
        await tick();

        const toQueryableActionBtn: HTMLElement | null = container.querySelector("#to-queryable-action");
        expect(toQueryableActionBtn).toBeInTheDocument();
        const queryableActionTextContent: HTMLElement = await screen.findByText(scheduleSearchController.selectedQueryable.name);
        expect(queryableActionTextContent).toBeInTheDocument();
        const toTripActionBtn: HTMLElement | null = container.querySelector("#to-trip-action");
        expect(toTripActionBtn).not.toBeInTheDocument();
    });
    it("should not show trip action button if trip is selected but queryable is not selected", async () => {
        tripsRepository.mockGetTripsSuccess = true;
        const trips: Trip[] = await tripsRepository.getTrips({ kind: "stop", name: "Stop No. 1", ids: [] }, new Date(Date.now()));
        tripSelectionController.selectedTrip = trips[0];
        scheduleSearchController.selectedQueryable = null;
        await tick();

        const toTripActionBtn: HTMLElement | null = container.querySelector("#to-trip-action");
        expect(toTripActionBtn).not.toBeInTheDocument();
        const toQueryableActionBtn: HTMLElement | null = container.querySelector("#to-queryable-action");
        expect(toQueryableActionBtn).not.toBeInTheDocument();
    });
    it("should show both action buttons if both queryable and trip are selected", async () => {
        queryablesRepository.mockGetQueryablesSuccess = true;
        const queryables: Queryable[] = await queryablesRepository.getQueryables();
        scheduleSearchController.selectedQueryable = queryables.filter((it: Queryable) => it.kind === "stop")[0];
        tripsRepository.mockGetTripsSuccess = true;
        const trips: Trip[] = await tripsRepository.getTrips(scheduleSearchController.selectedQueryable, new Date(Date.now()));
        tripSelectionController.selectedTrip = trips[0];
        await tick();

        const toTripActionBtn: HTMLElement | null = container.querySelector("#to-trip-action");
        expect(toTripActionBtn).toBeInTheDocument();
        const queryableActionTextContent: HTMLElement = await screen.findByText(scheduleSearchController.selectedQueryable.name);
        expect(queryableActionTextContent).toBeInTheDocument();
        const toQueryableActionBtn: HTMLElement | null = container.querySelector("#to-queryable-action");
        expect(toQueryableActionBtn).toBeInTheDocument();
    });
});