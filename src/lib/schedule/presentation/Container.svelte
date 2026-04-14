<script lang="ts">
    import { slide } from "svelte/transition";
    import type {Queryable} from "../data/model/queryable.ts";
    import type {Trip} from "../data/model/trip.ts";

    import URLParamController from "../../core/utils/urlParamController.ts";
    import ScheduleSearchController from "./scheduleSearchController.svelte.ts";
    import TripSelectionController from "./tripSelectionController.svelte.ts";
    import ActionController from "./actionController.svelte.ts";
    import MapController from "../../map/presentation/mapController.svelte.ts";

    import QueryableSearchBar from "./queryables/QueryableSearchBar.svelte";
    import DateTimeSelector from "./queryables/DateTimeSelector.svelte";
    import QueryableDropdown from "./queryables/QueryableDropdown.svelte";

    import TripDropdown from "./trips/TripDropdown.svelte";
    import TripDropdownItem from "./trips/TripDropdownItem.svelte";

    import DropdownExpanderArrow from "./DropdownExpanderArrow.svelte";
    import ActionSelector from "./ActionSelector.svelte";

    import type TripsRepository from "../data/repository/tripsRepository.ts";
    import TripsRepositoryImpl from "../data/repository/tripsRepositoryImpl.ts";
    import type QueryablesRepository from "../data/repository/queryablesRepository.ts";
    import QueryablesRepositoryImpl from "../data/repository/queryablesRepositoryImpl.ts";
    import TripActionButtons from "./trips/TripActionButtons.svelte";

    const queryablesRepository: QueryablesRepository = new QueryablesRepositoryImpl();
    const tripsRepository: TripsRepository = new TripsRepositoryImpl();

    const mapController: MapController = MapController.getMapControllerContext();
    const scheduleSearchController: ScheduleSearchController = ScheduleSearchController.setScheduleSearchControllerContext(queryablesRepository);
    const tripSelectionController: TripSelectionController = TripSelectionController.setTripSelectionControllerContext(queryablesRepository, tripsRepository);
    const actionController: ActionController = ActionController.setActionControllerContext(
        async () => { scheduleSearchController.fetchQueryables(); },
        async (queryableName: string) => {
            scheduleSearchController.fetchQueryables();
            await scheduleSearchController.queryablesFetchRequestResult?.then(() => {
                queryablesRepository.getQueryables().then((queryables: Queryable[]) => {
                    queryables.forEach((it: Queryable) => {
                        switch (it.kind){
                            case "route":
                                if (it.route_short_name === queryableName){
                                    scheduleSearchController.searchString = it.route_short_name;
                                    scheduleSearchController.selectedQueryable = it;
                                }
                                break;
                            case "stop":
                                if (it.name === queryableName){
                                    scheduleSearchController.searchString = it.name;
                                    scheduleSearchController.selectedQueryable = it;
                                }
                                break;
                        }
                    });
                });
            }).catch(() => URLParamController.purge());
        },
        async (tripId: string, dateIsoString: string) => {
            scheduleSearchController.date = new Date(Date.parse(dateIsoString));
            let tripFound: Trip | null = null;
            tripSelectionController.searchTrips(scheduleSearchController.selectedQueryable!!, scheduleSearchController.date);
            await tripSelectionController.tripRequestResult?.then(() => {
                tripFound = tripSelectionController.trips.find((it: Trip) => it.id === tripId) ?? null;
            });

            if (tripFound !== null){
                actionController.currAction = "tripSelection";
                tripSelectionController.selectedTrip = tripFound;
                tripSelectionController.dropdownShown = false;
                mapController.isTripLoading = true;
                await tripSelectionController.onTripSelect(
                    (stops, shapes, routeAssociated) => {
                        mapController.displayTrip(
                            tripFound!!,
                            stops,
                            shapes,
                            routeAssociated,
                            scheduleSearchController.selectedQueryable!!
                        );
                        mapController.isTripLoading = false;
                    }
                )
            } else {
                tripSelectionController.selectedTrip = null;
            }
        }
    );
</script>
<div class="flex w-full h-auto max-[600px]:p-1">
    <nav class="flex-[0_0_30px] h-auto flex flex-col gap-y-0.5 mr-1 pointer-events-auto">
        <ActionSelector/>
    </nav>
    <div class="min-w-72 w-[50svw] max-[600px] h-auto flex flex-col max-[600px]:flex-[1_0_auto] max-[600px]:min-w-60">
        {#if actionController.currAction === "queryableSearch"}
            <div id="queryable-action" in:slide={{ duration: 200, delay: 250 }} out:slide={{ duration: 200 }}
                on:introend={() => { scheduleSearchController.dropdownShown = true; }}
                class="z-[1] flex-[0_0_auto] w-full p-1 flex flex-col justify-center rounded-md bg-white pointer-events-auto">
                <QueryableSearchBar/>
                <DateTimeSelector/>
                <QueryableDropdown/>
            </div>
            <div in:slide={{ duration: 200, delay: 250 }} out:slide={{ duration: 200 }} class="z-0 h-full w-full pointer-events-none">
                <DropdownExpanderArrow/>
            </div>
        {:else if actionController.currAction === "tripSelection"}
            <div id="trip-action" in:slide={{ duration: 200, delay: 250 }} out:slide={{ duration: 200 }}
                on:introend={() => { tripSelectionController.dropdownShown = true; }}
                class="z-[1] flex-[0_0_auto] w-full p-1 flex flex-col justify-center rounded-md bg-white pointer-events-auto">
                <TripDropdownItem trip={tripSelectionController.selectedTrip}/>
                <TripDropdown/>
            </div>
            <div in:slide={{ duration: 200, delay: 250 }} out:slide={{ duration: 200 }} class="z-0 h-full w-full pointer-events-none">
                <DropdownExpanderArrow/>
            </div>
        {/if}
    </div>
    <div class="flex-[0_0_30px] h-auto flex flex-col gap-y-0.5 ml-1 pointer-events-auto">
        <TripActionButtons/>
    </div>
</div>
