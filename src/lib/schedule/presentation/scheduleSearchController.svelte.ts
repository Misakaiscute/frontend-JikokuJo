import {getContext, setContext} from "svelte";
import type QueryablesRepository from "../data/repository/queryablesRepository.ts";
import type {Queryable, Route, Stop} from "../data/model/queryable.ts";
import URLParamController from "../../core/utils/urlParamController.ts";

export default class ScheduleSearchController {
    private queryablesRepository: QueryablesRepository;
    constructor(queryablesRepository: QueryablesRepository,) {
        this.queryablesRepository = queryablesRepository;
    }

    private _searchString: string = $state("");
        get searchString(): string {
            return this._searchString;
        }
        set searchString(value: string) {
            this._searchString = value;
            if (value === ""){
                this.dropdownShown = true;
            }

            if (this._selectedQueryable?.kind === "stop" && this._selectedQueryable.name !== value) {
                this.selectedQueryable = null;
            } else if (this._selectedQueryable?.kind === "route" && this._selectedQueryable.short_name !== value) {
                this.selectedQueryable = null;
            }

            if (this._searchDebounce !== undefined) {
                clearTimeout(this._searchDebounce);
            }
            this._searchDebounce = setTimeout(async () => {
                this.filteredQueryables = await this.debounceHandler();
            }, 500);
        }
        
    private _searchDebounce: ReturnType<typeof setTimeout> | undefined = undefined;
    private debounceHandler = async (): Promise<Queryable[]> => {
        let queryables: Queryable[] | null = null;
        await this.queryablesRepository.getQueryables().then((it: Queryable[]) => queryables = it);

        return new Promise<Queryable[]>((resolve, reject) => {
            if (queryables === null) {
                reject("A járat és megállóadatok illegális állapotban vannak.");
            } else if (this.searchString === ""){
                resolve([]);
            } else {
                const filter: string = this.searchString;
                const filteredItems: Queryable[] = queryables.filter((it: Queryable) => {
                    if (it.kind === "stop"){
                        return (it as Stop).name.toLowerCase().includes(filter.toLowerCase());
                    } else if (it.kind === "route"){
                        return (it as Route).short_name.toLowerCase().includes(filter.toLowerCase());
                    }
                });
                resolve(filteredItems);
            }
        });
    }
    public filteredQueryables: Queryable[] = $state([]);

    private _selectedQueryable: Queryable | null = $state(null);
        get selectedQueryable(): Queryable | null {
            return this._selectedQueryable;
        }
        set selectedQueryable(value: Queryable | null) {
            if (value === null) {
                URLParamController.remove(ScheduleSearchController.QUERYABLE_QP_KEY);
            } else {
                switch (value.kind){
                    case "route":
                        URLParamController.set(ScheduleSearchController.QUERYABLE_QP_KEY, value.short_name);
                        break;
                    case "stop":
                        URLParamController.set(ScheduleSearchController.QUERYABLE_QP_KEY, value.name);
                        break;
                }
            }
            this._selectedQueryable = value;
        }

    public date: Date = $state(new Date(Date.now()));
    public dateTimePickerDropdown: "date" | "time" | null = $state(null);

    public dropdownShown: boolean = $state(true);

    public queryablesFetchRequestResult: Promise<void> = $state(new Promise(() => {}));
    public fetchQueryables = (): void => {
        this.queryablesFetchRequestResult = new Promise(async (resolve, reject) => {
            await this.queryablesRepository.getQueryables()
                .then(() => resolve())
                .catch((err: Error) => reject(new Error(err.message)));
        });
    }

    public static readonly QUERYABLE_QP_KEY: string = "queryable";

    public static readonly KEY: symbol = Symbol("SCHEDULE_SEARCH_CONTROLLER_KEY");
    public static setScheduleSearchControllerContext = (queryablesRepository: QueryablesRepository): ScheduleSearchController => {
        return setContext(ScheduleSearchController.KEY, new ScheduleSearchController(queryablesRepository));
    }
    public static getScheduleSearchControllerContext = () => {
        return getContext<ReturnType<typeof this.setScheduleSearchControllerContext>>(ScheduleSearchController.KEY);
    }
}