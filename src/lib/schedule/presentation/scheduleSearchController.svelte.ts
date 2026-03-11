import {getContext, setContext} from "svelte";
import type QueryablesRepository from "../data/repository/queryablesRepository.ts";
import type {Queryable, Route, Stop} from "../data/model/queryable.ts";
import QueryablesRepositoryImpl from "../data/repository/queryablesRepositoryImpl.ts";
import type TripsRepository from "../data/repository/tripsRepository.ts";
import TripsRepositoryImpl from "../data/repository/tripsRepositoryImpl.ts";

export default class ScheduleSearchController {
    private queryablesRepository: QueryablesRepository;
    private tripsRepository: TripsRepository;
    constructor(queryablesRepository: QueryablesRepository, tripsRepository: TripsRepository) {
        this.queryablesRepository = queryablesRepository;
        this.tripsRepository = tripsRepository;
    }

    private _searchString: string = $state("");
        get searchString(): string {
            return this._searchString;
        }
        set searchString(value: string) {
            this._searchString = value;
            if (this.selectedQueryable?.kind === "stop" && this.selectedQueryable.name !== this._searchString) {
                this.selectedQueryable = null
            } else if (this.selectedQueryable?.kind === "route" && this.selectedQueryable.route_short_name !== this._searchString) {
                this.selectedQueryable = null
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
    public selectedQueryable: Queryable | null = $state(null);
    public date: Date = $state(new Date(Date.now()));
    public dropdownShown: boolean = $state(true);

    public async fetchQueryables(): Promise<void> {
        const queryablesFetched: boolean = this.queryablesRepository.queryables !== null;
        if (queryablesFetched) {
            const queryablesAvailable: boolean = this.queryablesRepository.queryables!!.kind === "fulfill";
            if (queryablesAvailable) {
                return;
            } else {
                return this.queryablesRepository.getQueryables();
            }
        } else {
            return this.queryablesRepository.getQueryables();
        }
    }
    public async searchTrips(): Promise<void> {
        return this.tripsRepository.getTrips(this.selectedQueryable!!, this.date);
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