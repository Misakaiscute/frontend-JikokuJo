<script lang="ts">
    import { slide } from "svelte/transition";
    import ScheduleSearchController from "../scheduleSearchController.svelte.ts";

    import DropdownItem from "./TripDropdownItem.svelte";
    import TripDropdownGhostItem from "./TripDropdownGhostItem.svelte";

    const scheduleSearchController: ScheduleSearchController = ScheduleSearchController.getScheduleSearchControllerContext();
</script>
{#await scheduleSearchController.tripRequestResult}
    {#if scheduleSearchController.dropdownShown}
        <div transition:slide={{ duration: 200 }} class="flex-[1_0_auto] max-h-[60svh] w-full mt-1">
            <div class="h-full w-full flex flex-col p-0.5 rounded-md bg-zinc-200">
                {#each {length: 8} as _}
                    <TripDropdownGhostItem/>
                {/each}
            </div>
        </div>
    {/if}
{:then _}
    {#if scheduleSearchController.dropdownShown}
        <div transition:slide={{ duration: 200 }} class="flex-[1_0_auto] max-h-[60svh] w-full mt-1">
            <div class="h-full w-full flex flex-col p-0.5 rounded-md bg-zinc-200 overflow-y-auto">
                {#each scheduleSearchController.trips as trip}
                    <DropdownItem
                        trip={trip}
                        callback="{() => {
                            scheduleSearchController.selectedTrip = trip;
                            scheduleSearchController.dropdownShown = false;
                        }}"
                    />
                {/each}
            </div>
        </div>
    {/if}
{/await}