import {beforeEach, describe, expect, it} from "vitest";
import Component from "../../../../src/lib/schedule/presentation/queryables/QueryableSearchBar.svelte";
import ScheduleSearchController from "../../../../src/lib/schedule/presentation/scheduleSearchController.svelte.ts";
import QueryableRepositoryMock from "../../mock/queryableRepositoryMock.ts";
import {fireEvent, render, type RenderResult} from "@testing-library/svelte";
import {tick} from "svelte";

describe("Searchbar component", () => {
    let container: HTMLElement;
    let scheduleSearchController!: ScheduleSearchController;
    const queryablesRepository = new QueryableRepositoryMock();

    beforeEach(async () => {
        const context = new Map([[ScheduleSearchController.KEY, new ScheduleSearchController(queryablesRepository)]]);
        ({ container } = render(Component, {
            context: context,
        }));
        scheduleSearchController = context.get(ScheduleSearchController.KEY) as ScheduleSearchController;
        await tick();
    });

    it("should show loading while fetching initial data", async () => {
        scheduleSearchController.queryablesFetchRequestResult = new Promise(() => {});
        await tick();

        const loadingShimmer: HTMLElement | null = container.querySelector("#loading-shimmer");
        expect(loadingShimmer).toBeInTheDocument();
    });
    it("should show error and retry button if initial data fetching fails", async () => {
        queryablesRepository.mockGetQueryablesSuccess = false;

        await scheduleSearchController.fetchQueryables();
        scheduleSearchController.queryablesFetchRequestResult.catch(() => {});
        await tick();

        const errorMsg: HTMLElement | null = container.querySelector("#error-msg");
        expect(errorMsg).toBeInTheDocument();
        const retryBtn: HTMLElement | null = container.querySelector("#retry-btn");
        expect(retryBtn).toBeInTheDocument();
    });
    it("should retry fetching on retry button click", async () => {
        queryablesRepository.mockGetQueryablesSuccess = false;

        await scheduleSearchController.fetchQueryables();
        scheduleSearchController.queryablesFetchRequestResult.catch(() => {});
        await tick();
        queryablesRepository.mockGetQueryablesSuccess = null;
        const retryBtn: HTMLElement | null = container.querySelector("#retry-btn");
        retryBtn?.click();
        await tick();

        const loadingShimmer: HTMLElement | null = container.querySelector("#loading-shimmer");
        expect(loadingShimmer).toBeInTheDocument();
    });
    it("should show no button if no queryable is selected and search string is empty", async () => {
        queryablesRepository.mockGetQueryablesSuccess = true;

        await scheduleSearchController.fetchQueryables();
        await tick();

        const searchbarContainer: HTMLElement | null = container.querySelector("#searchbar")?.parentElement as HTMLElement;
        expect(searchbarContainer.children.length).toBe(1);
    });
    it("should show clear button if searchbar has text, but no queryable is selected", async () => {
        queryablesRepository.mockGetQueryablesSuccess = true;

        await scheduleSearchController.fetchQueryables();
        await tick();
        await fireEvent.input(container.querySelector("#searchbar")!, { target: { value: "smh" } });
        await tick();

        const clearBtn: HTMLElement | null = container.querySelector("#clear-btn");
        expect(clearBtn).toBeInTheDocument();
    });
    it("should clear search string on clear button click", async () => {
        queryablesRepository.mockGetQueryablesSuccess = true;

        await scheduleSearchController.fetchQueryables();
        await tick();
        await fireEvent.input(container.querySelector("#searchbar")!, { target: { value: "smh" } });
        await tick();
        const clearBtn: HTMLElement | null = container.querySelector("#clear-btn");
        clearBtn?.click();
        await tick();

        expect(scheduleSearchController.searchString).toBe("");
    });
    it("should show search button if searchbar has text and queryable is selected", async () => {
        queryablesRepository.mockGetQueryablesSuccess = true;

        await scheduleSearchController.fetchQueryables();
        await tick();
        await fireEvent.input(container.querySelector("#searchbar")!, { target: { value: "smh" } });
        scheduleSearchController.selectedQueryable = {
            kind: "stop",
            name: "Meow meow",
            ids: [],
        }
        await tick();

        const searchBtn: HTMLElement | null = container.querySelector("#search-btn");
        expect(searchBtn).toBeInTheDocument();
    });
});