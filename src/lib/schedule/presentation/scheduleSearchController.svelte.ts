import {getContext, setContext} from "svelte";
import type QueryablesRepository from "../data/repository/queryablesRepository.ts";
import type {Queryable, Route, Stop} from "../data/model/queryable.ts";
import QueryablesRepositoryImpl from "../data/repository/queryablesRepositoryImpl.ts";
import type TripsRepository from "../data/repository/tripsRepository.ts";
import TripsRepositoryImpl from "../data/repository/tripsRepositoryImpl.ts";
import URLParamController from "../../core/utils/urlParamController.ts";
import type {Trip} from "../data/model/trip.ts";

export default class ScheduleSearchController {
    private queryablesRepository: QueryablesRepository;
    private tripsRepository: TripsRepository;
    public searchState: "queryable_search" | "trip_selection" = $state("queryable_search");
    constructor(queryablesRepository: QueryablesRepository, tripsRepository: TripsRepository) {
        this.queryablesRepository = queryablesRepository;
        this.tripsRepository = tripsRepository;

        this.init();
    }

    private async init(): Promise<void> {
        if (URLParamController.contains(this.QUERYABLE_QUERY_PARAM_KEY)) {
            await this.handleQueryableSearchParams();
            if (URLParamController.contains(this.TRIP_QUERY_PARAM_KEY)) {
                await this.handleTripSearchParams();
                this.searchState = "trip_selection";
            } else {
                this.searchState = "queryable_search";
            }
        } else {
            this.fetchQueryables();
            this.searchState = "queryable_search";
        }
    }

    private async handleQueryableSearchParams(): Promise<void> {
        const searchParamQueryableName: string = URLParamController.get(this.QUERYABLE_QUERY_PARAM_KEY)!!;

        this.fetchQueryables();
        await this.queryablesRequestResult?.then(() => {
            if (this.queryablesRepository.queryables?.kind === "fulfill") {
                this.selectedQueryable = this.queryablesRepository.queryables?.data?.find((it: Queryable) => {
                    switch (it.kind){
                        case "stop":
                            if (it.name === searchParamQueryableName){
                                this.searchString = searchParamQueryableName;
                                return true;
                            }
                            break;
                        case "route":
                            if (it.route_short_name === searchParamQueryableName){
                                this.searchString = searchParamQueryableName;
                                return true;
                            }
                            break;
                    }
                }) ?? null;
            }
        });
    }
    private async handleTripSearchParams(): Promise<void> {
        const searchParamTripId: string = URLParamController.get(this.TRIP_QUERY_PARAM_KEY)!!;

        await this.searchTrips();
        await this.tripRequestResult?.then(() => {
            if (this.tripsRepository.trips?.kind === "fulfill") {
                this.selectedTrip = this.tripsRepository.trips.data!!.find((it: Trip) => {
                    return it.id === searchParamTripId;
                }) ?? null;
            }
        })
    }

    private _searchString: string = $state("");
        get searchString(): string {
            return this._searchString;
        }
        set searchString(value: string) {
            this._searchString = value;
            this.selectedTrip = null;
            if (value === ""){
                this.dropdownShown = true;
            }

            if (this._selectedQueryable?.kind === "stop" && this._selectedQueryable.name !== value) {
                this.selectedQueryable = null;
            } else if (this._selectedQueryable?.kind === "route" && this._selectedQueryable.route_short_name !== value) {
                this.selectedQueryable = null;
            }

            if (this.searchDebounce !== undefined) {
                clearTimeout(this.searchDebounce);
            }
            this.searchDebounce = setTimeout(() => {
                this.filteredQueryables = this.debounceHandler()
            }, 500);
        }
        
    private searchDebounce: ReturnType<typeof setTimeout> | undefined = undefined;
    private debounceHandler = (): Queryable[] => {
        if (this.queryablesRepository.queryables === null) {
            throw new Error("Queryables may not be null at this point found.");
        }
        if (this._searchString === ""){
            return [];
        }
        if (this.queryablesRepository.queryables.kind === "fulfill") {
            return this.queryablesRepository.queryables.data!!.filter((it: Queryable) => {
                if (it.kind === "stop"){
                    return (it as Stop).name.toLowerCase().includes(this._searchString.toLowerCase());
                } else if (it.kind === "route"){
                    return (it as Route).route_short_name.toLowerCase().includes(this._searchString.toLowerCase());
                }
            });
        } else return [];
    }

    public filteredQueryables: Queryable[] = $state([]);
    private _selectedQueryable: Queryable | null = $state(null);
        get selectedQueryable(): Queryable | null {
            return this._selectedQueryable;
        }
        set selectedQueryable(value: Queryable | null) {
            if (value === null) {
                URLParamController.remove(this.QUERYABLE_QUERY_PARAM_KEY);
            }
            this._selectedQueryable = value;
        }

    public date: Date = $state(new Date(Date.now()));
    public dropdownShown: boolean = $state(true);

    public queryablesRequestResult: Promise<void> | null = $state(null);
    public fetchQueryables(): void {
        const queryablesFetched: boolean = this.queryablesRepository.queryables?.kind === "fulfill";
        if (!queryablesFetched) {
            this.queryablesRequestResult = this.queryablesRepository.getQueryables() as unknown as Promise<void>;
        } else {
            this.queryablesRequestResult = Promise.resolve();
        }
    }

    public trips: Trip[] = $state([]);
    private _selectedTrip: Trip | null = $state(null);
        get selectedTrip(): Trip | null {
            return this._selectedTrip;
        }
        set selectedTrip(value: Trip | null) {
            if (value === null) {
                URLParamController.remove(this.TRIP_QUERY_PARAM_KEY);
            } else {
                URLParamController.set(this.TRIP_QUERY_PARAM_KEY, value.id);
            }
            this._selectedTrip = value;
        }
    public tripRequestResult: Promise<void> | null = $state(null);
    public async searchTrips(): Promise<void> {
        switch (this.selectedQueryable?.kind){
            case "route":
                URLParamController.set("queryable", this.selectedQueryable.route_short_name);
                break;
            case "stop":
                URLParamController.set("queryable", this.selectedQueryable.name);
                break;
        }
        this.tripRequestResult = this.tripsRepository.getTrips(this.selectedQueryable!!, this.date) as unknown as Promise<void>;

        this.tripRequestResult
            .then(() => {
                this.trips = this.tripsRepository.trips!!.data!!.sort((a: Trip, b: Trip) => {
                    return a.stops[0].arrival_time - b.stops[0].arrival_time
                });
            })
            .catch(() => {
                this.trips = [];
            });
    }

    public getRouteForTrip = (routeId: string): Route => {
        if (this.queryablesRepository.queryables?.kind === "fulfill") {
            const isFound: Queryable | null = this.queryablesRepository.queryables.data?.find((it: Queryable) => {
                if (it.kind === "route"){
                    return it.route_id === routeId;
                }
            }) ?? null;
            if (isFound === null){
                throw new Error("Nincs ilyen azonosítójú járat.");
            } else {
                return isFound as Route;
            }
        } else {
            throw new Error("A járatok nem elérhetőek.");
        }
    }

    public async onTripSelect(onSuccess: (() => void)): Promise<void> {
        //TODO: Implement
    }
    private readonly QUERYABLE_QUERY_PARAM_KEY: string = "queryable";
    private readonly TRIP_QUERY_PARAM_KEY: string = "trip";

    public static KEY: symbol = Symbol("SCHEDULE_SEARCH_KEY");
    public static setScheduleSearchControllerContext = (): ScheduleSearchController => {
        return setContext(ScheduleSearchController.KEY, new ScheduleSearchController(
            new QueryablesRepositoryImpl(),
            new TripsRepositoryImpl()
        ));
    }
    public static getScheduleSearchControllerContext = () => {
        return getContext<ReturnType<typeof this.setScheduleSearchControllerContext>>(ScheduleSearchController.KEY);
    }
}