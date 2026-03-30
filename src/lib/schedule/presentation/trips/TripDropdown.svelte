<script lang="ts">
    import { slide } from "svelte/transition";
    import MapController from "../../../map/mapController.svelte.ts";
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
            mapController.displayTrip(stops, shapes, routeAssociated, scheduleSearchController.selectedQueryable!!);
            mapController.isTripLoading = false;
        });
    }
</script>
{#await tripSelectionController.tripRequestResult}
    {#if tripSelectionController.dropdownShown}
        <div transition:slide={{ duration: 200 }} class="flex-[1_0_auto] max-h-[60svh] w-full mt-1">
            <div class="h-full w-full flex flex-col p-0.5 rounded-md bg-zinc-200">
                {#each {length: 8} as _}
                    <TripDropdownGhostItem/>
                {/each}
            </div>
        </div>
    {/if}
{:then _}
    {#if tripSelectionController.dropdownShown}
        <div transition:slide={{ duration: 200 }} class="flex-[1_0_auto] max-h-[60svh] w-full mt-1">
            <div class="h-full w-full flex flex-col p-0.5 rounded-md bg-zinc-200 overflow-y-auto">
                {#each tripSelectionController.trips as trip}
                    <DropdownItem
                        trip={trip}
                        callback={() => { onTripSelect(trip); }}
                    />
                {/each}
            </div>
        </div>
    {/if}
{/await}