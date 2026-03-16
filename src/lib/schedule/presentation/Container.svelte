<script lang="ts">
    import { slide } from "svelte/transition";

    import ScheduleSearchController from "./scheduleSearchController.svelte.ts";

    import QueryableSearchBar from "./queryables/QueryableSearchBar.svelte";
    import DateTimeSelector from "./queryables/DateTimeSelector.svelte";
    import QueryableDropdown from "./queryables/QueryableDropdown.svelte";

    import TripDropdown from "./trips/TripDropdown.svelte";

    import DropdownExpanderArrow from "./DropdownExpanderArrow.svelte";
    import NavigationContainer from "./NavigationContainer.svelte";
    import TripDropdownItem from "./trips/TripDropdownItem.svelte";

    const scheduleSearchController: ScheduleSearchController = ScheduleSearchController.setScheduleSearchControllerContext();
</script>
<div class="absolute left-0 top-0 p-2 flex">
    <nav class="flex-[0_0_30px] ml-1 h-auto flex flex-col gap-1 mr-1">
        <NavigationContainer/>
    </nav>
    <div class="min-w-80 w-[50svw] max-w-[450px] h-auto flex flex-col max-[460px]:w-full max-[460px]:min-w-60">
        {#if scheduleSearchController.searchState === "queryable_search"}
            <div in:slide={{ duration: 200, delay: 250 }} out:slide={{ duration: 200 }}
                 on:introend={() => { scheduleSearchController.dropdownShown = true; }}
                 class="z-[2] flex-[0_0_auto] w-full p-1 flex flex-col justify-center rounded-md bg-white">
                <QueryableSearchBar/>
                <DateTimeSelector/>
                <QueryableDropdown/>
            </div>
            <div in:slide={{ duration: 200, delay: 250 }} out:slide={{ duration: 200 }} class="z-[1] h-full w-full">
                <DropdownExpanderArrow/>
            </div>
        {:else if scheduleSearchController.searchState === "trip_selection"}
            <div in:slide={{ duration: 200, delay: 250 }} out:slide={{ duration: 200 }}
                 on:introend={() => { scheduleSearchController.dropdownShown = true; }}
                 class="z-[2] flex-[0_0_auto] w-full p-1 flex flex-col justify-center rounded-md bg-white">
                <TripDropdownItem trip={scheduleSearchController.selectedTrip}/>
                <TripDropdown/>
            </div>
            <div in:slide={{ duration: 200, delay: 250 }} out:slide={{ duration: 200 }} class="z-[1] h-full w-full">
                <DropdownExpanderArrow/>
            </div>
        {/if}
    </div>
</div>