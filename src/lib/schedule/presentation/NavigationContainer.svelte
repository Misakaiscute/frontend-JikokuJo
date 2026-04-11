<script lang="ts">
    import { fade } from "svelte/transition";
    import ScheduleSearchController from "./scheduleSearchController.svelte.ts";
    import ActionController from "./actionController.svelte.ts";
    import TripSelectionController from "./tripSelectionController.svelte.ts";
    import MapController from "../../map/presentation/mapController.svelte.ts";

    const mapController: MapController = MapController.getMapControllerContext();
    const scheduleSearchController: ScheduleSearchController = ScheduleSearchController.getScheduleSearchControllerContext();
    const tripSelectionController: TripSelectionController = TripSelectionController.getTripSelectionControllerContext();
    const actionController: ActionController = ActionController.getActionControllerContext();

    const onQueryableNavClick = (): void => {
        actionController.currAction = "queryableSearch";
        scheduleSearchController.dropdownShown = true;
        mapController.removeTrip(tripSelectionController.selectedTrip!!);
        tripSelectionController.selectedTrip = null;
    }
</script>
{#if scheduleSearchController.selectedQueryable !== null && scheduleSearchController.selectedQueryable.kind === "stop"}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <div transition:fade={{ duration: 300 }} role="button" tabindex="-1"
         class="flex-[0_0_auto] h-[min(auto,40svh] w-full py-2 pr-1 rounded-md border-2 flex flex-col items-center justify-center
               bg-white border-zinc-200 transition-all duration-200 hover:border-zinc-800 hover:cursor-pointer"
         onclick={onQueryableNavClick}
    >
        <p class="flex-[1_1_auto] w-full px-1 truncate [writing-mode:vertical-rl] rotate-180">
            {scheduleSearchController.selectedQueryable.name}
        </p>
    </div>
{:else if scheduleSearchController.selectedQueryable !== null && scheduleSearchController.selectedQueryable.kind === "route"}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <div transition:fade={{ duration: 300 }} role="button" tabindex="-1"
        style="--route-color: {'#' + (scheduleSearchController.selectedQueryable.color ?? '000000')}"
        class="flex-[0_0_auto] h-[min(auto,40svh)] w-full rounded-md border-2 border-[var(--route-color)] flex flex-col items-center justify-center
              bg-white transition-all duration-200 hover:cursor-pointer hover:bg-[color-mix(in_srgb,var(--route-color)_15%,white)]"
        onclick={onQueryableNavClick}
    >
        <p class="flex-[1_1_auto] w-full px-1 truncate [writing-mode:vertical-rl] rotate-180">
            {scheduleSearchController.selectedQueryable.route_short_name}
        </p>
    </div>
{/if}
{#if tripSelectionController.selectedTrip !== null}
    {#await tripSelectionController.getRouteForTrip(tripSelectionController.selectedTrip.route_id) then route}
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <div transition:fade={{ duration: 300 }} role="button" tabindex="-1"
            style="--route-color: {'#' + (route.color ?? '000000')}"
            class="flex-[0_0_auto] h-[min(auto,40svh)] w-full rounded-md border-2 border-[var(--route-color)] flex items-center justify-center
                  bg-white transition-all duration-200 hover: hover:cursor-pointer hover:bg-[color-mix(in_srgb,var(--route-color)_15%,white)]"
            onclick={() => {
                actionController.currAction = 'tripSelection';
                tripSelectionController.dropdownShown = true;
            }}
        >
            <p class="flex-[1_1_auto] w-full px-1 truncate [writing-mode:vertical-rl] rotate-180">
                {tripSelectionController.selectedTrip.headsign} - {route.route_short_name}
            </p>
        </div>
    {/await}
{/if}