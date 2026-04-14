<script lang="ts">
    import type {Trip} from "../../data/model/trip.ts";
    import type {Route} from "../../data/model/queryable.ts";

    import {timeFormatter} from "../../../core/utils/timeFormatter.ts";
    import TripSelectionController from "../tripSelectionController.svelte.ts";

    const tripSelectionController: TripSelectionController = TripSelectionController.getTripSelectionControllerContext()

    let { trip, callback = null }: { trip: Trip | null, callback?: (() => void) | null } = $props();
    let routeAssociated: Route | null = $state(null);

    $effect(() => {
        tripSelectionController.getRouteForTrip(trip?.route_id ?? "")
            .then((it: Route) => { routeAssociated = it; })
            .catch(() => { routeAssociated = null; });
    });
</script>
{#if trip !== null}
    <div id="trip-item" class="flex-[1_0_auto] max-h-16 w-full my-0.25 bg-white rounded-md flex items-center">
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <div role="button" tabindex="0"
            aria-label="{trip.headsign}"
            style="--route-color: {'#' + (routeAssociated?.color ?? '000000')}"
            class="flex-[1_0_auto] w-full px-1 grid grid-cols-5 grid-rows-2 gap-0.5 rounded-md border-2 border-[var(--route-color)]
                   { callback !== null ? 'transition-all duration-300 hover:cursor-pointer hover:bg-[color-mix(in_srgb,var(--route-color)_15%,white)]' : '' }"
            onclick="{ callback ?? (() => {}) }"
        >
            <div class="w-full h-full col-[1/4] row-[1/2] flex justify-center items-center truncate">
                <p class="flex-[1_0_auto] max-[800px]:text-sm truncate">{trip.headsign}</p>
            </div>
            <div class="w-full h-full col-[1/2] row-[2/2] flex justify-center items-center truncate">
                <p class="flex-[1_0_auto] text-xs truncate">{routeAssociated?.route_short_name}</p>
            </div>
            <div class="w-full h-full py-0.5 col-[4/6] row-span-full flex justify-center items-center truncate">
                <p class="flex-[1_0_auto] text-lg max-[800px]:text-base">{timeFormatter(trip.stops[0].arrival_time)} – {timeFormatter(trip.stops[trip.stops.length-1].arrival_time)}</p>
            </div>
        </div>
    </div>
{:else}
    <div id="trip-item" class="h-16 w-full my-0.25 bg-white border-2 border-zinc-200 rounded-md flex items-center">
        <div class="h-full w-full px-1 flex items-center justify-start truncate">
            Nincsen még indulás kiválasztva.
        </div>
    </div>
{/if}