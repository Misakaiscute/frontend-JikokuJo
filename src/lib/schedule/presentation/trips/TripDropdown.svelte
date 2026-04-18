<script lang="ts">
    import { slide } from "svelte/transition";
    import MapController from "../../../map/presentation/mapController.svelte.ts";
    import TripSelectionController from "../tripSelectionController.svelte.ts";
    import ScheduleSearchController from "../scheduleSearchController.svelte.ts";

    import DropdownItem from "./TripDropdownItem.svelte";
    import TripDropdownGhostItem from "./TripDropdownGhostItem.svelte";
    import type {Trip} from "../../data/model/trip.ts";

    const tripSelectionController: TripSelectionController = TripSelectionController.getTripSelectionControllerContext();
    const scheduleSearchController: ScheduleSearchController = ScheduleSearchController.getScheduleSearchControllerContext();
    const mapController: MapController = MapController.getMapControllerContext();

    const onTripSelect = (trip: Trip) => {
        tripSelectionController.selectedTrip = trip;
        tripSelectionController.dropdownShown = false;
        mapController.isTripLoading = true;
        tripSelectionController.onTripSelect((stops, shapes, routeAssociated) => {
            mapController.displayTrip(
                trip,
                stops,
                shapes,
                routeAssociated,
                scheduleSearchController.selectedQueryable!!
            );
            mapController.isTripLoading = false;
        });
    }
</script>
{#await tripSelectionController.tripRequestResult}
    {#if tripSelectionController.dropdownShown}
        <div id="trip-dropdown" transition:slide={{ duration: 200 }} class="flex-[1_0_auto] max-h-[60svh] w-full mt-1">
            <div class="h-full w-full flex flex-col gap-y-0.5 p-0.5 rounded-md bg-zinc-200">
                {#each {length: 8} as _}
                    <TripDropdownGhostItem/>
                {/each}
            </div>
        </div>
    {/if}
{:then _}
    {#if tripSelectionController.dropdownShown}
        <div id="trip-dropdown" transition:slide={{ duration: 200 }} class="flex-[1_0_auto] max-h-[60svh] w-full mt-1">
            {#if tripSelectionController.trips.length === 0}
                <div class="h-full w-full flex flex-col gap-y-0.5 rounded-md bg-zinc-200">
                    <div class="flex h-10 w-full items-center rounded-md border-2 border-zinc-200 bg-white">
                        <p id="error-msg" class="flex-[1_0_auto] text-center text-sm font-medium text-red-800 outline-none">
                            Nincs a keresésnek egy megfelelő elem sem.
                        </p>
                    </div>
                </div>
            {:else}
                <div class="h-full w-full flex flex-col gap-y-0.5 p-0.5 rounded-md bg-zinc-200 overflow-y-auto">
                    {#each tripSelectionController.trips as trip}
                        <DropdownItem
                            trip={trip}
                            callback={() => { onTripSelect(trip); }}
                        />
                    {/each}
                </div>
            {/if}
        </div>
    {/if}
{/await}