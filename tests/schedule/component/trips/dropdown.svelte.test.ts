import {assert, beforeEach, describe, expect, it} from "vitest";
import Component from "../../../../src/lib/schedule/presentation/trips/TripDropdown.svelte";
import TripSelectionController from "../../../../src/lib/schedule/presentation/tripSelectionController.svelte.ts";
import QueryableRepositoryMock from "../../mock/queryableRepositoryMock.ts";
import TripsRepositoryMock from "../../mock/tripsRepositoryMock.ts";
import {render} from "@testing-library/svelte";
import {tick} from "svelte";

describe("Trips dropdown component", async () => {
    let container!: HTMLElement;
    let tripSelectionController!: TripSelectionController;
    const queryablesRepository: QueryableRepositoryMock = new QueryableRepositoryMock();
    const tripsRepository: TripsRepositoryMock = new TripsRepositoryMock();
    beforeEach(async () => {
        const context = new Map([[TripSelectionController.KEY, new TripSelectionController(queryablesRepository, tripsRepository)]]);
        ({container} = render(Component, {
            context: context
        }));
        tripSelectionController = context.get(TripSelectionController.KEY) as TripSelectionController;
        await tick();
    });

    it("should show ghost items while promise is pending", async () => {
        tripSelectionController.dropdownShown = true;
        tripSelectionController.tripRequestResult = new Promise(() => {});
        await tick();

        const tripsGhostItems: NodeListOf<HTMLElement> | null = container.querySelectorAll("#trip-ghost-item") ?? null;
        if (tripsGhostItems === null) {
            assert.fail("Trip ghost items not found");
        } else {
            tripsGhostItems.forEach((item: HTMLElement) => {
                expect(item).toBeInTheDocument();
            });
        }
        const loadingShimmer: HTMLElement | null = container.querySelector("#loading-shimmer");
        expect(loadingShimmer).toBeInTheDocument();
    });
    it("should show trip items when trips available and dropdownShown is true", async () => {
        tripsRepository.mockGetTripsSuccess = true;
        tripSelectionController.dropdownShown = true;
        tripSelectionController.searchTrips({ kind: "stop", name: "Stop No. 1", ids: [] }, new Date(Date.now()));
        await tick();

        const tripItems: NodeListOf<HTMLElement> | null = container.querySelectorAll("#trip-item");
        expect(tripItems.length).toBe(26);
        tripItems.forEach((item: HTMLElement) => {
            expect(item).toBeInTheDocument();
        });
    });
    it("should not show trip items when trips available but dropdownShown is false", async () => {
        tripsRepository.mockGetTripsSuccess = true;
        tripSelectionController.dropdownShown = false;
        tripSelectionController.searchTrips({ kind: "stop", name: "Stop No. 1", ids: [] }, new Date(Date.now()));
        await tick();

        const tripItems: HTMLElement | null = container.querySelector("#trip-item");
        expect(tripItems).not.toBeInTheDocument();
    });
});