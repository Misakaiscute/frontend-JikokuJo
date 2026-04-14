import {beforeEach, describe, expect, it, vi} from "vitest";
import Component from "../../../../src/lib/schedule/presentation/queryables/QueryableDropdown.svelte";
import ScheduleSearchController from "../../../../src/lib/schedule/presentation/scheduleSearchController.svelte.ts";
import QueryableRepositoryMock from "../../mock/queryableRepositoryMock.ts";
import {fireEvent, render} from "@testing-library/svelte";
import {tick} from "svelte";
import type {Queryable} from "../../../../src/lib/schedule/data/model/queryable.ts";

describe("Queryable dropdown component", () => {
    let container!: HTMLElement;
    let scheduleSearchController!: ScheduleSearchController;
    const queryablesRepository: QueryableRepositoryMock = new QueryableRepositoryMock();

    beforeEach(async () => {
        const context = new Map([[ScheduleSearchController.KEY, new ScheduleSearchController(queryablesRepository)]]);
        ({container} = render(Component, {
            context: context
        }));
        scheduleSearchController = context.get(ScheduleSearchController.KEY) as ScheduleSearchController;
        await tick();
    });

    it("should show dropdown when queryables available, search string is present and dropdownShown is true", async () => {
        queryablesRepository.mockGetQueryablesSuccess = true;
        await scheduleSearchController.fetchQueryables()

        vi.useFakeTimers();
        scheduleSearchController.searchString = "17";
        vi.runAllTimers();
        await vi.runAllTimersAsync();
        await tick();
        vi.useRealTimers();

        const dropdownPanel: HTMLElement | null = container.querySelector("#queryable-dropdown");
        expect(dropdownPanel).toBeInTheDocument();
        expect(dropdownPanel?.children[0].children.length).toBe(2);
    });
    it("should not show dropdown when queryables available, search string is present, but dropdownShown is false", async () => {
        queryablesRepository.mockGetQueryablesSuccess = true;
        await scheduleSearchController.fetchQueryables();

        scheduleSearchController.dropdownShown = false;
        vi.useFakeTimers();
        scheduleSearchController.searchString = "17";
        vi.runAllTimers();
        await vi.runAllTimersAsync();
        await tick();
        vi.useRealTimers();

        const dropdownPanel: HTMLElement | null = container.querySelector("#queryable-dropdown");
        expect(dropdownPanel).not.toBeInTheDocument();
    });
    it("should not show dropdown when queryables not available", async () => {
        queryablesRepository.mockGetQueryablesSuccess = false;
        await scheduleSearchController.fetchQueryables();
        scheduleSearchController.queryablesFetchRequestResult.catch(() => {});
        await tick();

        const dropdownPanel: HTMLElement | null = container!.querySelector("#queryable-dropdown");
        expect(dropdownPanel).not.toBeInTheDocument();
    });
});