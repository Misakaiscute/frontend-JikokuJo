<script lang="ts">
    import { slide } from "svelte/transition";
    import type {StopDetailed} from "../data/model/stopDetailed.ts";
    import type {RoutePathPoint} from "../data/model/location.ts";
    import type {Route} from "../data/model/queryable.ts";

    import MapController from "../../map/mapController.svelte.ts";
    import ScheduleSearchController from "./scheduleSearchController.svelte.ts";

    import QueryableSearchBar from "./queryables/QueryableSearchBar.svelte";
    import DateTimeSelector from "./queryables/DateTimeSelector.svelte";
    import QueryableDropdown from "./queryables/QueryableDropdown.svelte";

    import TripDropdown from "./trips/TripDropdown.svelte";

    import DropdownExpanderArrow from "./DropdownExpanderArrow.svelte";
    import NavigationContainer from "./NavigationContainer.svelte";
    import TripDropdownItem from "./trips/TripDropdownItem.svelte";

    const mapController: MapController = MapController.getMapControllerContext();
    const scheduleSearchController: ScheduleSearchController = ScheduleSearchController.setScheduleSearchControllerContext(
        (stops: StopDetailed[], shapes: RoutePathPoint[], routeAssociated:Route) => { mapController.displayTrip(stops, shapes, routeAssociated); },
    );
</script>
<div class="absolute left-0 top-0 p-2 flex pointer-events-none max-[460px]:w-full">
    <nav class="flex-[0_0_30px] h-auto flex flex-col gap-1 mr-1 pointer-events-auto">
        <NavigationContainer/>
    </nav>
    <div class="min-w-72 w-[40svw] max-w-[450px] h-auto flex flex-col max-[460px]:flex-[1_0_auto] max-[460px]:min-w-60">
        {#if scheduleSearchController.searchState === "queryable_search"}
            <div in:slide={{ duration: 200, delay: 250 }} out:slide={{ duration: 200 }}
                 on:introend={() => { scheduleSearchController.dropdownShown = true; }}
                 class="z-[2] flex-[0_0_auto] w-full p-1 flex flex-col justify-center rounded-md bg-white pointer-events-auto">
                <QueryableSearchBar/>
                <DateTimeSelector/>
                <QueryableDropdown/>
            </div>
            <div in:slide={{ duration: 200, delay: 250 }} out:slide={{ duration: 200 }} class="z-[1] h-full w-full pointer-events-none">
                <DropdownExpanderArrow/>
            </div>
        {:else if scheduleSearchController.searchState === "trip_selection"}
            <div in:slide={{ duration: 200, delay: 250 }} out:slide={{ duration: 200 }}
                 on:introend={() => { scheduleSearchController.dropdownShown = true; }}
                 class="z-[2] flex-[0_0_auto] w-full p-1 flex flex-col justify-center rounded-md bg-white pointer-events-auto">
                <TripDropdownItem trip={scheduleSearchController.selectedTrip}/>
                <TripDropdown/>
            </div>
            <div in:slide={{ duration: 200, delay: 250 }} out:slide={{ duration: 200 }} class="z-[1] h-full w-full pointer-events-none">
                <DropdownExpanderArrow/>
            </div>
        {/if}
    </div>
</div>