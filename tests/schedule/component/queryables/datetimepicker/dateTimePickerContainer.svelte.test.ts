import {beforeEach, describe, it, expect} from "vitest";
import Component from "../../../../../src/lib/schedule/presentation/queryables/datetimepicker/Container.svelte";
import ScheduleSearchController from "../../../../../src/lib/schedule/presentation/scheduleSearchController.svelte.ts";
import QueryableRepositoryMock from "../../../mock/queryableRepositoryMock.ts";
import {render} from "@testing-library/svelte";
import {tick} from "svelte";

describe("Datetime picker component", async () => {
    let container!: HTMLElement;

    beforeEach(async () => {
        const context = new Map([[ScheduleSearchController.KEY, new ScheduleSearchController(new QueryableRepositoryMock())]]);
        ({container} = render(Component, {
            context: context
        }));
        await tick();
    });

    it("should only show date picker on date button click", async () => {
        const openBtn: HTMLElement | null = container.querySelector("#date-btn");
        openBtn?.click();
        await tick();

        expect(container.querySelector("#date-cards")).toBeInTheDocument();
        expect(container.querySelector("#time-selectors")).not.toBeInTheDocument();
    });
    it("should only show time picker on date button click", async () => {
        const openBtn: HTMLElement | null = container.querySelector("#time-btn");
        openBtn?.click();
        await tick();

        expect(container.querySelector("#time-selectors")).toBeInTheDocument();
        expect(container.querySelector("#date-cards")).not.toBeInTheDocument();
    });

    it("should go from date picker to time picker", async () => {
        (container.querySelector("#date-btn") as HTMLElement)?.click();
        await tick();
        (container.querySelector("#time-btn") as HTMLElement)?.click();
        await tick();

        expect(container.querySelector("#time-selectors")).toBeInTheDocument();
        expect(container.querySelector("#date-cards")).not.toBeInTheDocument();
    });
    it("should go from time picker to date picker", async () => {
        (container.querySelector("#time-btn") as HTMLElement)?.click();
        await tick();
        (container.querySelector("#date-btn") as HTMLElement)?.click();
        await tick();

        expect(container.querySelector("#date-cards")).toBeInTheDocument();
        expect(container.querySelector("#time-selectors")).not.toBeInTheDocument();
    });
});