import {describe, expect, it} from "vitest";
import MapController from "../../../src/lib/map/presentation/mapController.svelte.ts";
import Component from "../../../src/lib/map/presentation/Map.svelte";
import {render} from "@testing-library/svelte";
import {tick} from "svelte";

describe("Map component", () => {
    it("should show a loader when a trip is loading", async () => {
        const context = new Map([[MapController.KEY, new MapController()]]);
        const { container } = render(Component, {
            context: context
        });
        const mapController: MapController = context.get(MapController.KEY) as MapController;
        mapController.isTripLoading = true;

        await tick();
        const loader = container.querySelector("#loader");
        expect(loader).toBeInTheDocument();
    });
});