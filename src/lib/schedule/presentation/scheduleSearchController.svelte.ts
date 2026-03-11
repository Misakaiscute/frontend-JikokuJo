import {getContext, setContext} from "svelte";
import type QueryablesRepository from "../data/repository/queryablesRepository.ts";
import type {Queryable, Route, Stop} from "../data/model/queryable.ts";
import QueryablesRepositoryImpl from "../data/repository/queryablesRepositoryImpl.ts";
import type TripsRepository from "../data/repository/tripsRepository.ts";
import TripsRepositoryImpl from "../data/repository/tripsRepositoryImpl.ts";
import URLParamController from "../../core/utils/urlParamController.ts";

export default class ScheduleSearchController {
    private queryablesRepository: QueryablesRepository;
    private tripsRepository: TripsRepository;
    constructor(queryablesRepository: QueryablesRepository, tripsRepository: TripsRepository) {
        this.queryablesRepository = queryablesRepository;
        this.tripsRepository = tripsRepository;

        this.handleSearchParams();
    }
    private handleSearchParams = (): void => {
        const searchParamQueryableName: string | null = URLParamController.get("queryable");
        if (searchParamQueryableName !== null) {
            this.fetchQueryables();
            this.queryablesRequestResult?.then(() => {
                if (this.queryablesRepository.queryables?.kind === "fulfill") {
                    this._selectedQueryable = this.queryablesRepository.queryables?.data?.find((it: Queryable) => {
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
    }

    public searchState: "queryable_search" | "trip_selection" = "queryable_search";

    private _searchString: string = $state("");
        get searchString(): string {
            return this._searchString;
        }
        set searchString(value: string) {
            this._searchString = value;
            if (this._selectedQueryable?.kind === "stop" && this._selectedQueryable.name !== this._searchString) {
                this._selectedQueryable = null
            } else if (this._selectedQueryable?.kind === "route" && this._selectedQueryable.route_short_name !== this._searchString) {
                this._selectedQueryable = null
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
                URLParamController.remove("queryable");
            }
            this._selectedQueryable = value;
        }

    public date: Date = $state(new Date(Date.now()));
    public dropdownShown: boolean = $state(true);

    public queryablesRequestResult: Promise<void> | null = $state(null);
    public fetchQueryables(): void {
        const queryablesFetched: boolean = this.queryablesRepository.queryables !== null;
        if (queryablesFetched) {
            const queryablesAvailable: boolean = this.queryablesRepository.queryables!!.kind === "fulfill";
            if (!queryablesAvailable) {
                this.queryablesRequestResult = this.queryablesRepository.getQueryables() as unknown as Promise<void>;
            }
        } else {
            this.queryablesRequestResult = this.queryablesRepository.getQueryables() as unknown as Promise<void>;
        }
    }
    public tripsRequestResult: Promise<void> | null = $state(null);
    public async searchTrips(): Promise<void> {
        switch (this.selectedQueryable?.kind){
            case "route":
                URLParamController.set("queryable", this.selectedQueryable.route_short_name);
                break;
            case "stop":
                URLParamController.set("queryable", this.selectedQueryable.name);
                break;
        }
        this.searchState = "trip_selection";
        console.log(this.searchState);
        this.tripsRequestResult = this.tripsRepository.getTrips(this.selectedQueryable!!, this.date) as unknown as Promise<void>;
    }

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