import {getContext, setContext} from "svelte";
import type QueryablesRepository from "../data/repository/queryablesRepository.ts";
import type {Queryable, Route, Stop} from "../data/model/queryable.ts";
import QueryablesRepositoryImpl from "../data/repository/queryablesRepositoryImpl.ts";
import type TripsRepository from "../data/repository/tripsRepository.ts";
import TripsRepositoryImpl from "../data/repository/tripsRepositoryImpl.ts";
import URLParamController from "../../core/utils/urlParamController.ts";
import type {Trip} from "../data/model/trip.ts";
import type {StopDetailed} from "../data/model/stopDetailed.ts";
import type {RoutePathPoint} from "../data/model/location.ts";

export default class ScheduleSearchController {
    private queryablesRepository: QueryablesRepository;
    private tripsRepository: TripsRepository;
    public searchState: "queryable_search" | "trip_selection" = $state("queryable_search");
    constructor(
        queryablesRepository: QueryablesRepository, tripsRepository: TripsRepository,
        onTripIdSet: (stops: StopDetailed[], shapes: RoutePathPoint[], routeAssociated: Route) => void
    ) {
        this.queryablesRepository = queryablesRepository;
        this.tripsRepository = tripsRepository;

        this.init(onTripIdSet);
    }

    private async init(onTripIdSet: (stops: StopDetailed[], shapes: RoutePathPoint[], routeAssociated: Route) => void): Promise<void> {
        if (URLParamController.contains(this.QUERYABLE_QP_KEY)) {
            this.searchState = "queryable_search";
            await this.handleQueryableSearchParams();
            if (this.selectedQueryable === null){
                URLParamController.remove(this.QUERYABLE_QP_KEY);
                URLParamController.remove(this.TRIP_QP_KEY);
                return;
            }
        }
        if (URLParamController.contains(this.DATETIME_QP_KEY)){
            const isoDate: string = URLParamController.get(this.DATETIME_QP_KEY)!!;
            try {
                this.date = new Date(Date.parse(isoDate));
            } catch {
                this.date = new Date(Date.now());
            }
        }
        if (URLParamController.contains(this.TRIP_QP_KEY)){
            this.searchState = "trip_selection";
            await this.handleTripSearchParams();
            if (this.selectedTrip === null) {
                URLParamController.remove(this.TRIP_QP_KEY);
                return;
            }
            await this.onTripSelect(onTripIdSet);
        } else {
            this.searchState = "queryable_search";
            this.fetchQueryables();
            return;
        }
    }

    private async handleQueryableSearchParams(): Promise<void> {
        const searchParamQueryableName: string = URLParamController.get(this.QUERYABLE_QP_KEY)!!;

        this.fetchQueryables();
        await this.queryablesRequestResult?.then(() => {
            if (this.queryablesRepository.queryables?.kind === "fulfill") {
                this.selectedQueryable = this.queryablesRepository.queryables?.data?.find((it: Queryable) => {
                    switch (it.kind){
                        case "stop":
                            if (it.name === searchParamQueryableName){
                                this._searchString = searchParamQueryableName;
                                this.filteredQueryables = this.filterQueryables(searchParamQueryableName);
                                return true;
                            }
                            break;
                        case "route":
                            if (it.route_short_name === searchParamQueryableName){
                                this._searchString = searchParamQueryableName;
                                this.filteredQueryables = this.filterQueryables(searchParamQueryableName);
                                return true;
                            }
                            break;
                    }
                }) ?? null;
            }
        });
    }
    private async handleTripSearchParams(): Promise<void> {
        const searchParamTripId: string = URLParamController.get(this.TRIP_QP_KEY)!!;

        await this.searchTrips();
        await this.tripRequestResult?.then(() => {
            if (this.trips !== null) {
                this.selectedTrip = this.trips.find((it: Trip) => {
                    return it.id === searchParamTripId;
                }) ?? null;
            }
        });
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
            throw new Error("A járat és megállóadatok illegális állapotban vannak.");
        }
        if (this._searchString === ""){
            return [];
        }
        return this.filterQueryables(this.searchString);
    }
    private filterQueryables = (filter: string): Queryable[] => {
        const queryablesAvailable: boolean = this.queryablesRepository.queryables !== null && this.queryablesRepository.queryables.kind === "fulfill";
        if (queryablesAvailable) {
            return this.queryablesRepository.queryables!!.data!!.filter((it: Queryable) => {
                if (it.kind === "stop"){
                    return (it as Stop).name.toLowerCase().includes(filter.toLowerCase());
                } else if (it.kind === "route"){
                    return (it as Route).route_short_name.toLowerCase().includes(filter.toLowerCase());
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
                URLParamController.remove(this.QUERYABLE_QP_KEY);
            } else {
                switch (value.kind){
                    case "route":
                        URLParamController.set(this.QUERYABLE_QP_KEY, value.route_short_name);
                        break;
                    case "stop":
                        URLParamController.set(this.QUERYABLE_QP_KEY, value.name);
                        break;
                }
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
                URLParamController.remove(this.TRIP_QP_KEY);
            } else {
                URLParamController.set(this.TRIP_QP_KEY, value.id);
            }
            this._selectedTrip = value;
        }

    public tripRequestResult: Promise<void> | null = $state(null);
    public async searchTrips(): Promise<void> {
        URLParamController.set(this.DATETIME_QP_KEY, this.date.toISOString());
        this.tripRequestResult = new Promise((resolve, reject) => {
            this.tripsRepository.getTrips(this.selectedQueryable!!, this.date)
                .then((res: Trip[]) => {
                    this.trips = res;
                    resolve();
                })
                .catch((err: Error) => {
                    reject(err.message);
                });
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
    public tripSelectRequestResult: Promise<void> | null = $state(null);
    public async onTripSelect(onSuccess: ((stops: StopDetailed[], shapes: RoutePathPoint[], routeAssociated: Route) => void)): Promise<void> {
        if (this.selectedTrip !== null) {
            let stops: StopDetailed[] = [];
            let shapes: RoutePathPoint[] = [];
            await this.tripsRepository.getStops(this.selectedTrip)
                .then((res: StopDetailed[]) => {
                    stops = res;
                })
                .catch((err: Error) => {
                    this.tripSelectRequestResult = Promise.reject(err.message);
                    return;
                });
            await this.tripsRepository.getShapes(this.selectedTrip)
                .then((res: RoutePathPoint[]) => {
                    shapes = res;
                })
                .catch((err: Error) => {
                    this.tripSelectRequestResult = Promise.reject(err.message);
                    return;
                });

            this.tripSelectRequestResult = Promise.resolve();
            onSuccess(stops, shapes, this.getRouteForTrip(this.selectedTrip.route_id));
        }
    }
    private readonly QUERYABLE_QP_KEY: string = "queryable";
    private readonly DATETIME_QP_KEY: string = "at";
    private readonly TRIP_QP_KEY: string = "trip";

    public static readonly KEY: symbol = Symbol("SCHEDULE_SEARCH_CONTROLLER_KEY");
    public static setScheduleSearchControllerContext =
        (onTripIdSet: (stops: StopDetailed[], shapes: RoutePathPoint[], routeAssociated: Route) => void): ScheduleSearchController => {
            return setContext(ScheduleSearchController.KEY, new ScheduleSearchController(
                new QueryablesRepositoryImpl(),
                new TripsRepositoryImpl(),
                onTripIdSet
            ));
        }
    public static getScheduleSearchControllerContext = () => {
        return getContext<ReturnType<typeof this.setScheduleSearchControllerContext>>(ScheduleSearchController.KEY);
    }
}