<script lang="ts">
    import { fade } from "svelte/transition";
    import ScheduleSearchController from "./scheduleSearchController.svelte.ts";

    const scheduleSearchController: ScheduleSearchController = ScheduleSearchController.getScheduleSearchControllerContext();
</script>
{#if scheduleSearchController.selectedQueryable != null && scheduleSearchController.selectedQueryable.kind === "stop"}
    <nav transition:fade={{ duration: 300 }}
         class="flex-[0_0_auto] min-h-16 max-h-60 w-full py-2 pr-1 rounded-md border-2 flex flex-col items-center justify-center
               bg-white border-zinc-200 transition-all duration-200 hover:border-zinc-800 hover:cursor-pointer">
        <button
            aria-label="vissza a kereséshez"
            class="flex-[1_1_auto] w-full text-sm truncate [writing-mode:vertical-rl] rotate-180 hover:cursor-pointer"
            onclick="{() => {
                scheduleSearchController.searchState = 'queryable_search';
                scheduleSearchController.dropdownShown = true;
            }}"
        >{scheduleSearchController.selectedQueryable.name}</button>
    </nav>
{:else if scheduleSearchController.selectedQueryable != null && scheduleSearchController.selectedQueryable.kind === "route"}
    <nav
        transition:fade={{ duration: 300 }}
        style="--route-color: {'#' + (scheduleSearchController.selectedQueryable.color ?? '000000')}"
        class="flex-[0_0_auto] min-h-16 max-h-60 w-full rounded-md border-2 border-[var(--route-color)] flex flex-col items-center justify-center
              bg-white transition-all duration-200 hover:cursor-pointer hover:bg-[color-mix(in_srgb,var(--route-color)_15%,white)]">
        <button
            aria-label="vissza a kereséshez"
            class="flex-[1_1_auto] w-full pl-0.5 px-2 truncate [writing-mode:vertical-rl] rotate-180 hover:cursor-pointer"
            onclick="{() => {
                scheduleSearchController.searchState = 'queryable_search';
                scheduleSearchController.dropdownShown = true;
            }}"
        >{scheduleSearchController.selectedQueryable.route_short_name}</button>
    </nav>
{/if}
{#if scheduleSearchController.selectedTrip !== null}
    <nav
        transition:fade={{ duration: 300 }}
        style="--route-color: {'#' + (scheduleSearchController.getRouteForTrip(scheduleSearchController.selectedTrip.route_id).color ?? '000000')}"
        class="flex-[0_0_auto] min-h-16 max-h-60 w-full rounded-md border-2 border-[var(--route-color)] flex flex-col items-center justify-center
              bg-white transition-all duration-200 hover: hover:cursor-pointer hover:bg-[color-mix(in_srgb,var(--route-color)_15%,white)]">
        <button
            aria-label="vissza a járatkiválasztáshoz"
            class="flex-[1_1_auto] w-full pl-0.5 px-2 truncate [writing-mode:vertical-rl] rotate-180 hover:cursor-pointer"
            onclick="{() => {
                scheduleSearchController.searchState = 'trip_selection';
                scheduleSearchController.dropdownShown = true;
            }}"
        >
            {scheduleSearchController.selectedTrip.headsign} - {scheduleSearchController.getRouteForTrip(scheduleSearchController.selectedTrip.route_id).route_short_name}
        </button>
    </nav>
{/if}