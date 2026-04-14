import {describe, it, expect} from "vitest";
import Component from "../../../../src/lib/schedule/presentation/trips/TripDropdownItem.svelte";
import TripSelectionController from "../../../../src/lib/schedule/presentation/tripSelectionController.svelte.ts";
import QueryableRepositoryMock from "../../mock/queryableRepositoryMock.ts";
import TripsRepositoryMock from "../../mock/tripsRepositoryMock.ts";
import {fireEvent, render} from "@testing-library/svelte";
import {tick} from "svelte";
import type {Trip} from "../../../../src/lib/schedule/data/model/trip.ts";

describe("Trip dropdown item component", async () => {
    let container!: HTMLElement;
    let tripSelectionController!: TripSelectionController;
    const queryablesRepository: QueryableRepositoryMock = new QueryableRepositoryMock();
    const tripsRepository: TripsRepositoryMock = new TripsRepositoryMock();

    const renderComponent = (async (trip: Trip | null, callback: (() => void) | null) => {
        const context = new Map([[TripSelectionController.KEY, new TripSelectionController(queryablesRepository, tripsRepository)]]);
        ({container} = render(Component, {
            context: context,
            props: {
                trip: trip,
                callback: callback
            }
        }));
        tripSelectionController = context.get(TripSelectionController.KEY) as TripSelectionController;
        await tick();
    });
    it("should show item with contents and onclick", async () => {
        tripsRepository.mockGetTripsSuccess = true;
        const trips: Trip[] = await tripsRepository.getTrips({ kind: "stop", name: "Stop No. 1", ids: [] }, new Date(Date.now()));
        let callbackTriggered: boolean = false;
        await renderComponent(trips[0], () => { callbackTriggered = true; });

        const dataContainer: HTMLElement | null = container.querySelector("#trip-item")?.children[0] as HTMLElement;
        dataContainer?.click();

        expect(dataContainer).toBeInTheDocument();
        expect(dataContainer?.role?.toLowerCase()).toBe("button");
        expect(dataContainer?.children.length).toBe(3);
        expect(callbackTriggered).toBe(true);
    });
    it("should show empty and no onclick", async () => {
        tripsRepository.mockGetTripsSuccess = true;
        const trips: Trip[] = await tripsRepository.getTrips({ kind: "stop", name: "Stop No. 1", ids: [] }, new Date(Date.now()));
        let callbackTriggered: boolean = false;
        await renderComponent(null, () => { callbackTriggered = true; });

        const dataContainer: HTMLElement | null = container.querySelector("#trip-item");
        expect(dataContainer).toBeInTheDocument();
        expect(dataContainer?.role).not.toBe("button");
        dataContainer?.click();
        expect(callbackTriggered).toBe(false);
    });
});