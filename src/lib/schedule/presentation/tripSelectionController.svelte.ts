import {getContext, setContext} from "svelte";
import type QueryablesRepository from "../data/repository/queryablesRepository.ts";
import type {Queryable, Route} from "../data/model/queryable.ts";
import type TripsRepository from "../data/repository/tripsRepository.ts";
import type {Trip} from "../data/model/trip.ts";
import type {StopDetailed} from "../data/model/stopDetailed.ts";
import type {RoutePathPoint} from "../data/model/location.ts";
import URLParamController from "../../core/utils/urlParamController.ts";

export default class TripSelectionController {
    private queryablesRepository: QueryablesRepository;
    private tripsRepository: TripsRepository;

    private date: Date | null = null;

    constructor(
        queryablesRepository: QueryablesRepository,
        tripsRepository: TripsRepository,
    ) {
        this.queryablesRepository = queryablesRepository;
        this.tripsRepository = tripsRepository;
    }

    public dropdownShown: boolean = $state(false);

    public trips: Trip[] = $state([]);
    private _selectedTrip: Trip | null = $state(null);
        get selectedTrip(): Trip | null {
            return this._selectedTrip;
        }
        set selectedTrip(value: Trip | null) {
            if (value === null){
                this._selectedTrip = null;
                URLParamController.remove(TripSelectionController.DATETIME_QP_KEY);
                URLParamController.remove(TripSelectionController.TRIP_QP_KEY);
            } else {
                this._selectedTrip = value;
                URLParamController.set(TripSelectionController.DATETIME_QP_KEY, this.date?.toISOString() ?? "null");
                URLParamController.set(TripSelectionController.TRIP_QP_KEY, value.id);
            }
        }

    public tripRequestResult: Promise<void> | null = $state(null);
    public searchTrips = (forQueryable: Queryable, forDate: Date): void => {
        this.tripRequestResult = new Promise((resolve, reject) => {
            this.tripsRepository.getTrips(forQueryable, forDate)
                .then((res: Trip[]) => {
                    this.trips = res;
                    this.date = forDate;
                    resolve();
                })
                .catch((err: Error) => {
                    reject(err.message);
                });
        });
    }

    public getRouteForTrip = async (routeId: string): Promise<Route> => {
        let queryables: Queryable[] | null = null;
        await this.queryablesRepository.getQueryables().then((it: Queryable[]) => queryables = it);

        return new Promise<Route>((resolve, reject) => {
            if (queryables !== null) {
                const isFound: Queryable | null = queryables.find((it: Queryable) => {
                    if (it.kind === "route"){
                        return it.route_id === routeId;
                    }
                }) ?? null;
                if (isFound === null){
                    reject("Nincs ilyen azonosítójú járat.");
                } else {
                    resolve(isFound as Route);
                }
            } else {
                reject("A járatok nem elérhetőek.");
            }
        });
    }

    public tripSelectRequestResult: Promise<void> | null = $state(null);
    public async onTripSelect(
        onSuccess: ((stops: StopDetailed[], shapes: RoutePathPoint[], routeAssociated: Route) => void)
    ): Promise<void> {
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
            onSuccess(
                stops,
                shapes,
                await this.getRouteForTrip(this.selectedTrip.route_id) as Route
            );
        }
    }
    public static readonly DATETIME_QP_KEY: string = "at";
    public static readonly TRIP_QP_KEY: string = "trip";

    private static readonly KEY: symbol = Symbol("TRIP_SELECTION_CONTROLLER_KEY");
    public static setTripSelectionControllerContext = (
        queryablesRepository: QueryablesRepository,
        tripsRepository: TripsRepository,
    ): TripSelectionController => {
        return setContext(TripSelectionController.KEY, new TripSelectionController(queryablesRepository, tripsRepository));
    }
    public static getTripSelectionControllerContext = () => {
        return getContext<ReturnType<typeof this.setTripSelectionControllerContext>>(TripSelectionController.KEY);
    }
}