<script lang="ts">
    import { fade } from "svelte/transition";
    import ScheduleSearchController from "./scheduleSearchController.svelte.ts";
    import ActionController from "./actionController.svelte.ts";
    import TripSelectionController from "./tripSelectionController.svelte.ts";
    import MapController from "../../map/mapController.svelte.ts";

    const mapController: MapController = MapController.getMapControllerContext();
    const scheduleSearchController: ScheduleSearchController = ScheduleSearchController.getScheduleSearchControllerContext();
    const tripSelectionController: TripSelectionController = TripSelectionController.getTripSelectionControllerContext();
    const actionController: ActionController = ActionController.getActionControllerContext();

    const onQueryableNavClick = (): void => {
        actionController.currAction = "queryableSearch";
        scheduleSearchController.dropdownShown = true;
        tripSelectionController.selectedTrip = null;
        mapController.removeTrip();
    }
</script>
{#if scheduleSearchController.selectedQueryable !== null && scheduleSearchController.selectedQueryable.kind === "stop"}
    <nav transition:fade={{ duration: 300 }}
         class="flex-[0_0_auto] min-h-16 max-h-60 w-full py-2 pr-1 rounded-md border-2 flex flex-col items-center justify-center
               bg-white border-zinc-200 transition-all duration-200 hover:border-zinc-800 hover:cursor-pointer">
        <button
            aria-label="vissza a kereséshez"
            class="flex-[1_1_auto] w-full text-sm truncate [writing-mode:vertical-rl] rotate-180 hover:cursor-pointer"
            onclick={onQueryableNavClick}
        >{scheduleSearchController.selectedQueryable.name}</button>
    </nav>
{:else if scheduleSearchController.selectedQueryable !== null && scheduleSearchController.selectedQueryable.kind === "route"}
    <nav transition:fade={{ duration: 300 }}
        style="--route-color: {'#' + (scheduleSearchController.selectedQueryable.color ?? '000000')}"
        class="flex-[0_0_auto] min-h-16 max-h-60 w-full rounded-md border-2 border-[var(--route-color)] flex flex-col items-center justify-center
              bg-white transition-all duration-200 hover:cursor-pointer hover:bg-[color-mix(in_srgb,var(--route-color)_15%,white)]">
        <button
            aria-label="vissza a kereséshez"
            class="flex-[1_1_auto] w-full pl-0.5 px-2 truncate [writing-mode:vertical-rl] rotate-180 hover:cursor-pointer"
            onclick={onQueryableNavClick}
        >{scheduleSearchController.selectedQueryable.route_short_name}</button>
    </nav>
{/if}
{#if tripSelectionController.selectedTrip !== null}
    {#await tripSelectionController.getRouteForTrip(tripSelectionController.selectedTrip.route_id) then route}
        <nav
            transition:fade={{ duration: 300 }}
            style="--route-color: {'#' + (route.color ?? '000000')}"
            class="flex-[0_0_auto] min-h-16 max-h-60 w-full rounded-md border-2 border-[var(--route-color)] flex flex-col items-center justify-center
                  bg-white transition-all duration-200 hover: hover:cursor-pointer hover:bg-[color-mix(in_srgb,var(--route-color)_15%,white)]">
            <button
                aria-label="vissza a járatkiválasztáshoz"
                class="flex-[1_1_auto] w-full pl-0.5 px-2 truncate [writing-mode:vertical-rl] rotate-180 hover:cursor-pointer"
                onclick={() => {
                    actionController.currAction = 'tripSelection';
                    tripSelectionController.dropdownShown = true;
                }}>
                    {tripSelectionController.selectedTrip.headsign} - {route.route_short_name}
            </button>
        </nav>
    {/await}
{/if}