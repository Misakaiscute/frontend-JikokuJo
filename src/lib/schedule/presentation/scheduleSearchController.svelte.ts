import {getContext, setContext} from "svelte";
import type QueryablesRepository from "../data/repository/queryablesRepository.ts";
import type {Queryable, Route, Stop} from "../data/model/queryable.ts";
import QueryablesRepositoryImpl from "../data/repository/queryablesRepositoryImpl.ts";

export default class ScheduleSearchController {
    private queryablesRepository: QueryablesRepository;

    public searchString: string = $state("");
    public filteredQueryables: Queryable[] = $derived.by(() => {
        if (this.queryablesRepository.queryables === null) {
            throw new Error("Queryables may not be null at this point found.");
        }
        if (this.searchString === ""){
            return [];
        }
        if (this.queryablesRepository.queryables.kind === "fulfill") {
            return this.queryablesRepository.queryables.data!!.filter((it: Queryable) => {
                if (it.kind === "stop"){
                    return (it as Stop).name.toLowerCase().includes(this.searchString.toLowerCase());
                } else if (it.kind === "route"){
                    return (it as Route).route_short_name.toLowerCase().includes(this.searchString.toLowerCase());
                }
            });
        } else return [];
    });
    public error: Error | null = $state(null);

    constructor(queryablesRepository: QueryablesRepository) {
        this.queryablesRepository = queryablesRepository;
    }

    public fetchQueryables = (): void => {
        this.queryablesRepository.getQueryables()
    }

    public static KEY: symbol = Symbol("SCHEDULE_SEARCH_KEY");
    public static setScheduleSearchControllerContext = (): ScheduleSearchController => {
        return setContext(ScheduleSearchController.KEY, new ScheduleSearchController(
            new QueryablesRepositoryImpl()
        ));
    }
    public static getScheduleSearchControllerContext = () => {
        return getContext<ReturnType<typeof this.setScheduleSearchControllerContext>>(ScheduleSearchController.KEY);
    }
}