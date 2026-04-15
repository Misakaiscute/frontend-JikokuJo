import {describe, expect, it, vi} from "vitest";
import Component from "../../../../../src/lib/schedule/presentation/queryables/datetimepicker/DatePicker.svelte";
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

    it("should show have 17 (2 before, 1 today, 14 after) time options at midnight", async () => {
        const noon: Date = new Date(2026, 3, 16, 12, 0, 0, 0);
        vi.setSystemTime(noon)
        await renderComponent(noon);

        const datesDisabled: NodeListOf<HTMLElement> = container.querySelectorAll("#date-card-item-disabled");
        const datesSelectable: NodeListOf<HTMLElement> = container.querySelectorAll("#date-card-item");
        expect(datesDisabled.length).toBe(2);
        expect(datesSelectable.length).toBe(15);
    });
});