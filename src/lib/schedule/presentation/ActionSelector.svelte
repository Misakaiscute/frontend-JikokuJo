<script lang="ts">
    import { fade } from "svelte/transition";
    import ScheduleSearchController from "./scheduleSearchController.svelte.ts";
    import ActionController from "./actionController.svelte.ts";
    import TripSelectionController from "./tripSelectionController.svelte.ts";
    import MapController from "../../map/presentation/mapController.svelte.ts";
    import type {Route} from "../data/model/queryable.ts";

    const mapController: MapController = MapController.getMapControllerContext();
    const scheduleSearchController: ScheduleSearchController = ScheduleSearchController.getScheduleSearchControllerContext();
    const tripSelectionController: TripSelectionController = TripSelectionController.getTripSelectionControllerContext();
    const actionController: ActionController = ActionController.getActionControllerContext();

    const onQueryableNavClick = (): void => {
        actionController.currAction = "queryableSearch";
        scheduleSearchController.dropdownShown = true;
        mapController.removeTrip();
        tripSelectionController.selectedTrip = null;
    }
    const onTripNavClick = (): void => {
        actionController.currAction = "tripSelection";
        tripSelectionController.dropdownShown = true;
    }

    let route: Route | null = $state(null);
    $effect(() => {
        if (tripSelectionController.selectedTrip === null) {
            route = null;
        } else {
            tripSelectionController.getRouteForTrip(tripSelectionController.selectedTrip.route_id)
                .then((res: Route) => route = res)
                .catch(() => route = null);
        }
    });
</script>
{#if scheduleSearchController.selectedQueryable !== null && scheduleSearchController.selectedQueryable.kind === "stop"}
    <div id="to-queryable-action" transition:fade={{ duration: 300 }} role="button" tabindex="-1" title="{scheduleSearchController.selectedQueryable.name}"
         class="flex-[0_1_auto] max-h-[40svh] w-full py-2 rounded-md border-2 flex flex-col items-center justify-center
               bg-white border-zinc-200 transition-all duration-200 hover:border-zinc-800 hover:cursor-pointer pointer-events-auto"
         onclick={onQueryableNavClick} onkeydown={() => {}}
    >
        <p class="flex-[1_1_auto] w-full px-1 font-medium text-zinc-800 truncate [writing-mode:vertical-rl] rotate-180">
            {scheduleSearchController.selectedQueryable.name}
        </p>
    </div>
{:else if scheduleSearchController.selectedQueryable !== null && scheduleSearchController.selectedQueryable.kind === "route"}
    <div id="to-queryable-action" transition:fade={{ duration: 300 }} role="button" tabindex="-1" title="{scheduleSearchController.selectedQueryable.short_name}"
        style="--route-color: {'#' + (scheduleSearchController.selectedQueryable.color ?? '000000')}"
        class="flex-[0_1_auto] max-h-[40svh] w-full py-2 rounded-md border-2 border-(--route-color) flex flex-col items-center justify-center
              bg-white transition-all duration-200 hover:cursor-pointer hover:bg-[color-mix(in_srgb,var(--route-color)_15%,white)] pointer-events-auto"
        onclick={onQueryableNavClick} onkeydown={() => {}}
    >
        <p class="flex-[1_1_auto] w-full px-1 font-medium text-zinc-800 truncate [writing-mode:vertical-rl] rotate-180">
            {scheduleSearchController.selectedQueryable.short_name}
        </p>
    </div>
{/if}
{#if scheduleSearchController.selectedQueryable !== null && tripSelectionController.selectedTrip !== null}
    <div id="to-trip-action" transition:fade={{ duration: 300 }} role="button" tabindex="-1" title="{tripSelectionController.selectedTrip.headsign} - {route?.short_name}"
        style="--route-color: {'#' + (route?.color ?? '000000')}"
        class="flex-[0_1_auto] max-h-[40svh] w-full py-2 rounded-md border-2 border-(--route-color) flex flex-col items-center justify-center
              bg-white transition-all duration-200 hover:cursor-pointer hover:bg-[color-mix(in_srgb,var(--route-color)_15%,white)] pointer-events-auto"
        onclick={onTripNavClick} onkeydown={() => {}}
    >
        <p class="flex-[1_1_auto] w-full px-1 font-medium text-zinc-800 truncate [writing-mode:vertical-rl] rotate-180">
            <span class="text-zinc-800">{tripSelectionController.selectedTrip.headsign} - </span>
            <span class="text-(--route-color)">{route?.short_name}</span>
        </p>
    </div>
{/if}
