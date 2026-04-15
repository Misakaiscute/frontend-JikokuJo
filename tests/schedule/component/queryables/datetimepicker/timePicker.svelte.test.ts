import {describe, expect, it, vi} from "vitest";
import Component from "../../../../../src/lib/schedule/presentation/queryables/datetimepicker/TimePicker.svelte";
import ScheduleSearchController from "../../../../../src/lib/schedule/presentation/scheduleSearchController.svelte.ts";
import QueryableRepositoryMock from "../../../mock/queryableRepositoryMock.ts";
import {render} from "@testing-library/svelte";
import {tick} from "svelte";
import {dateHelpers} from "../../../../../src/lib/schedule/utils/dateHelpers.ts";

describe("Time picker component", () => {
    let container!: HTMLElement;

    const renderComponent = (async (forDate: Date) => {
        const scheduleSearchControllerCxt = new ScheduleSearchController(new QueryableRepositoryMock());
        scheduleSearchControllerCxt.date = forDate;
        const context = new Map([[ScheduleSearchController.KEY, scheduleSearchControllerCxt]]);
        ({container} = render(Component, {
            context: context
        }));
        await tick();
    });

    it("should show 24 * 4 (96) time options at midnight", async () => {
        const forDate: Date = dateHelpers(dateHelpers(Date.now()).addDays(1)).getStartOfDay();
        await renderComponent(forDate);

        const timeSelectors: NodeListOf<HTMLElement> = container.querySelectorAll("#time-selector-item");
        expect(timeSelectors.length).toBe(96);
    });
    it("should show 12 * 4 (48) time options at noon", async () => {
        const noon: Date = new Date(2026, 3, 15, 12, 0, 0, 0);
        vi.setSystemTime(noon)
        await renderComponent(noon);

        const timeSelectors: NodeListOf<HTMLElement> = container.querySelectorAll("#time-selector-item");
        expect(timeSelectors.length).toBe(48);
    });
    it("should show no time options at 23:59", async () => {
        const oneMinBeforeMidnight: Date = new Date(2026, 3, 15, 23, 59, 0, 0);
        vi.setSystemTime(oneMinBeforeMidnight)
        await renderComponent(oneMinBeforeMidnight);

        const timeSelectors: NodeListOf<HTMLElement> = container.querySelectorAll("#time-selector-item");
        expect(timeSelectors.length).toBe(0);
    });
});