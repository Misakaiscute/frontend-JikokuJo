import Leaflet, {CircleMarker, type LatLngExpression, type LatLngTuple, Polyline} from "leaflet";
import type {StopDetailed} from "../schedule/data/model/stopDetailed.ts";
import type {Location, RoutePathPoint} from "../schedule/data/model/location.ts";
import type {Queryable, Route} from "../schedule/data/model/queryable.ts";
import {getContext, setContext} from "svelte";
import {findCenterPoint, findSwitchingPoint} from "./mapUtils.ts";

export default class MapController {
    private map: Leaflet.Map | undefined;
    private tripBeforeStopPolyline: Polyline | null = null;
    private tripAfterStopPolyline: Polyline | null = null;
    private tripBeforeStopPolylineShadow: Polyline | null = null;
    private tripAfterStopPolylineShadow: Polyline | null = null;
    private tripStops: CircleMarker[] = [];

    public isTripLoading: boolean = $state(false);

    public bindMap(mapHolderId: HTMLDivElement) {
        this.map = Leaflet.map(mapHolderId, {
            zoomControl: false,
        }).setView([47.49031325038684, 19.053912410022516], 15);

        Leaflet.control.zoom({
            position: "bottomleft"
        }).addTo(this.map);

        Leaflet.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a>"
        }).addTo(this.map);
    }
    public removeTrip = () => {
        this.tripStops.forEach((it: CircleMarker) => it.removeFrom(this.map!!));
        this.tripStops = [];
        this.tripAfterStopPolyline?.removeFrom(this.map!!);
        this.tripAfterStopPolyline = null;
        this.tripBeforeStopPolyline?.removeFrom(this.map!!);
        this.tripBeforeStopPolyline = null;
        this.tripAfterStopPolylineShadow?.removeFrom(this.map!!);
        this.tripAfterStopPolylineShadow = null;
        this.tripBeforeStopPolylineShadow?.removeFrom(this.map!!);
        this.tripBeforeStopPolylineShadow = null;
    }

    public displayTrip = (
        stops: StopDetailed[],
        shapes: RoutePathPoint[],
        routeAssociated: Route,
        forQueryable: Queryable
    ): void => {
        this.removeTrip();

        switch(forQueryable.kind){
            case "route":
                this.displayTripForRoute(shapes, stops, routeAssociated);
                break;
            case "stop":
                const stopSelected: StopDetailed = stops.find((it: StopDetailed) => {
                    return forQueryable.ids.find((id: string) => it.id === id);
                })!!;
                const switchingPointIndex: number = findSwitchingPoint(stopSelected, shapes);
                this.displayTripForStop(stopSelected, switchingPointIndex, shapes, stops, routeAssociated);
                break;
        }

        this.alignToTripCenter(shapes);
        this.zoomOutToFitRoute(shapes);
    }
    private displayTripForStop = (
        stopSelected: StopDetailed,
        switchingPointIndex: number,
        shapes: RoutePathPoint[],
        stops: StopDetailed[],
        routeAssociated: Route,
    ): void => {
        //setting the shape
        let beforeSwitchingPointPolylinePoints: LatLngExpression[] = [];
        let afterSwitchingPointPolylinePoints: LatLngExpression[] = [];
        for(let i = 0; i < shapes.length; i++){
            if (i < switchingPointIndex){
                beforeSwitchingPointPolylinePoints.push(shapes[i].location as unknown as LatLngExpression);
            } else {
                afterSwitchingPointPolylinePoints.push(shapes[i].location as unknown as LatLngExpression);
            }
        }
        this.tripBeforeStopPolylineShadow = Leaflet.polyline(beforeSwitchingPointPolylinePoints, {
            color: '#3d3d3d',
            weight: 10,
            opacity: 0.9,
            lineCap: 'round',
            lineJoin: 'round'
        }).addTo(this.map!!);
        this.tripBeforeStopPolyline = Leaflet.polyline(beforeSwitchingPointPolylinePoints, {
            color: `#5c5c5c`,
            weight: 8,
            opacity: 1,
            lineCap: 'round',
            lineJoin: 'round'
        }).addTo(this.map!!);
        this.tripAfterStopPolylineShadow = Leaflet.polyline(afterSwitchingPointPolylinePoints, {
            color: '#ffffff',
            weight: 10,
            opacity: 0.9,
            lineCap: 'round',
            lineJoin: 'round'
        }).addTo(this.map!!);
        this.tripAfterStopPolyline = Leaflet.polyline(afterSwitchingPointPolylinePoints, {
            color: `#${routeAssociated.color}`,
            weight: 8,
            opacity: 1,
            lineCap: 'round',
            lineJoin: 'round'
        }).addTo(this.map!!);
        //setting the stops
        let afterSwitchingPoint: boolean = false;
        stops.forEach((it: StopDetailed) => {
            if (it.id === stopSelected.id) {
                afterSwitchingPoint = true;
            }

            let circle!: CircleMarker;
            if (afterSwitchingPoint) {
                circle = Leaflet.circleMarker([it.location.lat, it.location.lon], {
                    radius: 7,
                    color: `#${routeAssociated.color}`,
                    weight: 3,
                    fillColor: '#ffffff',
                    fillOpacity: 1,
                });
            } else {
                circle = Leaflet.circleMarker([it.location.lat, it.location.lon], {
                    radius: 7,
                    color: '#3d3d3d',
                    weight: 3,
                    fillColor: '#5c5c5c',
                    fillOpacity: 1,
                });
            }
            this.tripStops.push(circle);
            circle.addTo(this.map!!);
        });
    }
    private displayTripForRoute = (
        shapes: RoutePathPoint[],
        stops: StopDetailed[],
        routeAssociated: Route
    ): void => {
        const route: LatLngExpression[] = shapes as unknown as LatLngExpression[];

        this.tripAfterStopPolylineShadow = Leaflet.polyline(route, {
            color: '#ffffff',
            weight: 10,
            opacity: 0.9,
            lineCap: 'round',
            lineJoin: 'round'
        }).addTo(this.map!!);
        this.tripAfterStopPolyline = Leaflet.polyline(route, {
            color: `#${routeAssociated.color}`,
            weight: 8,
            opacity: 1,
            lineCap: 'round',
            lineJoin: 'round'
        }).addTo(this.map!!);
        //setting the stops
        stops.forEach((it: StopDetailed) => {
            const circle: CircleMarker = Leaflet.circleMarker([it.location.lat, it.location.lon], {
                radius: 7,
                color: `#${routeAssociated.color}`,
                weight: 3,
                fillColor: '#ffffff',
                fillOpacity: 1,
            });
            this.tripStops.push(circle);
            circle.addTo(this.map!!);
        });
    }
    private alignToTripCenter = (pathPoints: RoutePathPoint[]): void => {
        const centerPoint: Location = findCenterPoint(pathPoints);
        this.map!!.setView([centerPoint.lat, centerPoint.lon] as LatLngExpression);
    }
    private zoomOutToFitRoute = (pathPoints: RoutePathPoint[]): void => {
        const latLngExpressions = pathPoints.map((it: RoutePathPoint) =>
            [it.location.lat, it.location.lon] as LatLngTuple
        );

        this.map!!.fitBounds(latLngExpressions, {
            padding: [10, 10]
        });
    }

    private static readonly KEY: symbol = Symbol("MAP_CONTROLLER_KEY");
    public static setMapControllerContext = (): MapController => {
        return setContext(this.KEY, new MapController());
    }
    public static getMapControllerContext = () => {
        //return getContext<ReturnType<typeof this.setMapControllerContext>>(this.KEY);
        const ctx = getContext<ReturnType<typeof this.setMapControllerContext>>(this.KEY);
        if (!ctx) throw new Error("MapController context not found — did you call setMapControllerContext?");
        return ctx;
    }
}