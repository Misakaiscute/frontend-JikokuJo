<script lang="ts">
    import type {Trip} from "../../data/model/trip.ts";
    import {getRouteDesignation, type Route} from "../../data/model/queryable.ts";

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
    <div id="trip-item" class="flex-[1_0_auto] max-h-16 w-full my-pc bg-white rounded-md flex items-center">
        <div role="button" tabindex="0" title="{trip.headsign}"
            style="--route-color: {'#' + (routeAssociated?.color ?? '000000')}"
            class="flex-[1_0_auto] w-full px-1 grid grid-cols-5 grid-rows-2 gap-0.5 rounded-md border-2 border-(--route-color)
                   { callback !== null ? 'transition-all duration-300 hover:cursor-pointer hover:bg-[color-mix(in_srgb,var(--route-color)_15%,white)]' : '' }"
            onclick={ callback ?? (() => {}) } onkeydown={() => {}}
        >
            <div class="w-full h-full pr-2 col-[1/4] row-[1/2] flex justify-center items-center truncate">
                <p class="w-full min-w-0 font-medium text-zinc-800 max-[800px]:text-sm truncate">
                    {trip.headsign}
                </p>
            </div>
            <div class="w-full min-w-0 h-full col-[1/4] row-[2/2] flex justify-center items-center truncate">
                <p class="w-full min-w-0 font-medium text-xs truncate">
                    <span class="text-zinc-800">{routeAssociated?.short_name} - </span>
                    <span class="text-(--route-color)">{getRouteDesignation.get(routeAssociated?.type ?? 8)}</span>
                </p>
            </div>
            <div class="w-full min-w-0 h-full py-0.5 col-[4/6] row-span-full flex justify-center items-center truncate">
                <p class="w-full min-w-0 text-lg text-zinc-800 max-[800px]:text-base max-[400px]:text-sm">
                    {timeFormatter(trip.stops[0].arrival_time)} – {timeFormatter(trip.stops[trip.stops.length-1].arrival_time)}
                </p>
            </div>
        </div>
    </div>
{:else}
    <div id="trip-item" class="h-16 w-full my-px bg-white border-2 border-zinc-200 rounded-md flex items-center">
        <div class="h-full w-full flex items-center text-lg font-medium text-zinc-800 justify-center truncate">
            Nincsen még indulás kiválasztva
        </div>
    </div>
{/if}