import {beforeEach, describe, expect, it} from "vitest";
import TripSelectionController from "../../../../src/lib/schedule/presentation/tripSelectionController.svelte.ts";
import QueryableRepositoryMock from "../../mock/queryableRepositoryMock.ts";
import TripsRepositoryMock from "../../mock/tripsRepositoryMock.ts";
import UserRepositoryMock from "../../../profile/mock/userRepositoryMock.ts";
import {render} from "@testing-library/svelte";
import Component from "../../../../src/lib/schedule/presentation/trips/TripActionButtons.svelte";
import {tick} from "svelte";
import UserController from "../../../../src/lib/profile/presentation/userController.svelte.ts";
import type {Trip} from "../../../../src/lib/schedule/data/model/trip.ts";
import MapController from "../../../../src/lib/map/presentation/mapController.svelte.ts";

describe("Trip action buttons component", () => {
    let container!: HTMLElement;
    let tripSelectionController!: TripSelectionController;
    let userController!: UserController;
    const queryablesRepository: QueryableRepositoryMock = new QueryableRepositoryMock();
    const tripsRepository: TripsRepositoryMock = new TripsRepositoryMock();
    const userRepository: UserRepositoryMock = new UserRepositoryMock();

    beforeEach(async () => {
        const context = new Map<symbol, unknown>([
            [TripSelectionController.KEY, new TripSelectionController(queryablesRepository, tripsRepository)],
            [UserController.KEY, new UserController(userRepository)],
            [MapController.KEY, new MapController()],
        ]);
        ({container} = render(Component, {
            context: context
        }));
        tripSelectionController = context.get(TripSelectionController.KEY) as TripSelectionController;
        userController = context.get(UserController.KEY) as UserController;
        userController.isLoggedIn.catch(() => {});
        await tick();
    });

    it("should show buttons when trip is selected", async () => {
        tripsRepository.mockGetTripsSuccess = true;
        const trips: Trip[] = await tripsRepository.getTrips({ kind: "stop", name: "Stop No. 1", ids: [] }, new Date(Date.now()));
        tripSelectionController.selectedTrip = trips[0];
        await tick();

        expect(container.querySelector("#share-btn")).toBeInTheDocument();
        expect(container.querySelector("#track-realtime-btn")).toBeInTheDocument();
        expect(container.querySelector("#favourite-btn")).toBeInTheDocument();
    });
    it("should show tracking button as not clickable when user is not logged in", async () => {
        tripsRepository.mockGetTripsSuccess = true;
        const trips: Trip[] = await tripsRepository.getTrips({ kind: "stop", name: "Stop No. 1", ids: [] }, new Date(Date.now()));
        tripSelectionController.selectedTrip = trips[0];
        userController.isLoggedIn = Promise.reject(new Error("User is not logged in"));
        await tick();

        const trackRealtimeBtn: HTMLElement | null = container.querySelector("#track-realtime-btn");
        expect(trackRealtimeBtn).toBeInTheDocument();
        expect(trackRealtimeBtn?.tagName.toLowerCase()).toBe("div");
    });
    it("should show favourite button as not clickable when user is not logged in", async () => {
        tripsRepository.mockGetTripsSuccess = true;
        const trips: Trip[] = await tripsRepository.getTrips({ kind: "stop", name: "Stop No. 1", ids: [] }, new Date(Date.now()));
        tripSelectionController.selectedTrip = trips[0];
        userController.isLoggedIn = Promise.reject(new Error("User is not logged in"));
        await tick();

        const trackRealtimeBtn: HTMLElement | null = container.querySelector("#favourite-btn");
        expect(trackRealtimeBtn).toBeInTheDocument();
        expect(trackRealtimeBtn?.tagName.toLowerCase()).toBe("div");
    });
    it("should show tracking button clickable when user is logged in", async () => {
        tripsRepository.mockGetTripsSuccess = true;
        const trips: Trip[] = await tripsRepository.getTrips({ kind: "stop", name: "Stop No. 1", ids: [] }, new Date(Date.now()));
        tripSelectionController.selectedTrip = trips[0];
        userController.isLoggedIn = Promise.resolve();
        await tick();

        const trackRealtimeBtn: HTMLElement | null = container.querySelector("#track-realtime-btn");
        expect(trackRealtimeBtn).toBeInTheDocument();
        expect(trackRealtimeBtn?.role).toBe("button");
    });
    it("should not show buttons when trip is not selected", async () => {
        expect(container.querySelector("#share-btn")).not.toBeInTheDocument();
        expect(container.querySelector("#track-realtime-btn")).not.toBeInTheDocument();
        expect(container.querySelector("#favourite-btn")).not.toBeInTheDocument();
    });
});