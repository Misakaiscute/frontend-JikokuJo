import {getContext, setContext} from "svelte";
import URLParamController from "../../core/utils/urlParamController.ts";
import TripSelectionController from "./tripSelectionController.svelte.ts";
import ScheduleSearchController from "./scheduleSearchController.svelte.ts";

export default class ActionController {
    public currAction: "queryableSearch" | "tripSelection" = $state("queryableSearch");

    constructor(
        onEmptyURL: () => Promise<void>,
        onQueryableNamePresent: (queryableName: string) => Promise<void>,
        onTripIdPresent: (tripId: string, dateIsoString: string) => Promise<void>,
    ){
        this.init(onEmptyURL, onQueryableNamePresent, onTripIdPresent);
    }
    private init = async (
        onEmptyURL: () => Promise<void>,
        onQueryableNamePresent: (queryableName: string) => Promise<void>,
        onTripIdPresent: (tripId: string, dateIsoString: string) => Promise<void>,
    ): Promise<void> => {
        const isQueryableNamePresent: boolean = URLParamController.contains(ScheduleSearchController.QUERYABLE_QP_KEY);
        const isTripIdPresent: boolean = URLParamController.contains(TripSelectionController.TRIP_QP_KEY) && URLParamController.contains(TripSelectionController.DATETIME_QP_KEY);

        if (isTripIdPresent && isQueryableNamePresent) {
            await onQueryableNamePresent(URLParamController.get(ScheduleSearchController.QUERYABLE_QP_KEY)!!);
            await onTripIdPresent(
                URLParamController.get(TripSelectionController.TRIP_QP_KEY)!!,
                URLParamController.get(TripSelectionController.DATETIME_QP_KEY)!!
            );
            this.currAction = "tripSelection";
        } else if (isQueryableNamePresent) {
            await onQueryableNamePresent(URLParamController.get(ScheduleSearchController.QUERYABLE_QP_KEY)!!);
        } else {
            URLParamController.purge();
            await onEmptyURL();
        }
    }

    public static readonly KEY: symbol = Symbol("ACTION_CONTROLLER_KEY");
    public static setActionControllerContext = (
        onEmptyURL: () => Promise<void>,
        onQueryableNamePresent: (queryableName: string) => Promise<void>,
        onTripIdPresent: (tripId: string, dateIsoString: string) => Promise<void>,
    ): ActionController => {
        return setContext(this.KEY, new ActionController(onEmptyURL, onQueryableNamePresent, onTripIdPresent));
    }
    public static getActionControllerContext = () => {
        return getContext<ReturnType<typeof this.setActionControllerContext>>(this.KEY);
    }
}