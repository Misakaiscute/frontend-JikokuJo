import Leaflet, {CircleMarker, type LatLngExpression, type LatLngTuple, Polyline} from "leaflet";
import type {StopDetailed} from "../schedule/data/model/stopDetailed.ts";
import type {Location, RoutePathPoint} from "../schedule/data/model/location.ts";
import type {Route} from "../schedule/data/model/queryable.ts";
import {getContext, setContext} from "svelte";
import {findCenterPoint} from "./mapUtils.ts";

export default class MapController {
    private map: Leaflet.Map | undefined;
    private currentTripPolyline: Polyline | null = null;
    private currentTripPolylineShadow: Polyline | null = null;
    private currentTripStops: CircleMarker[] = [];

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

    public displayTrip = (stops: StopDetailed[], shapes: RoutePathPoint[], routeAssociated: Route): void => {
        if (this.currentTripPolyline !== null) {
            this.currentTripPolyline.removeFrom(this.map!!);
            this.currentTripPolyline = null;
        }
        if (this.currentTripPolylineShadow !== null) {
            this.currentTripPolylineShadow.removeFrom(this.map!!);
            this.currentTripPolylineShadow = null;
        }
        if (this.currentTripStops.length > 0) {
            this.currentTripStops.forEach((it: CircleMarker) => {
                it.removeFrom(this.map!!);
            });
            this.currentTripStops = [];
        }

        const polylinePoints: LatLngExpression[][] = shapes.map((it: RoutePathPoint) => {
            return [it.location.lat, it.location.lon] as unknown as LatLngExpression[];
        });
        this.currentTripPolylineShadow = Leaflet.polyline(polylinePoints, {
            color: '#ffffff',
            weight: 14,
            opacity: 0.9,
            lineCap: 'round',
            lineJoin: 'round'
        });
        this.currentTripPolyline = Leaflet.polyline(polylinePoints, {
            color: `#${routeAssociated.color}`,
            weight: 8,
            opacity: 1,
            lineCap: 'round',
            lineJoin: 'round'
        });
        this.currentTripPolylineShadow.addTo(this.map!!);
        this.currentTripPolyline.addTo(this.map!!);

        stops.forEach((it: StopDetailed) => {
            const circle = Leaflet.circleMarker([it.location.lat, it.location.lon], {
                radius: 7,
                color: `#${routeAssociated.color}`,
                weight: 3,
                fillColor: '#ffffff',
                fillOpacity: 1,
            });
            this.currentTripStops.push(circle);
            circle.addTo(this.map!!);
        });

        this.alignToTripCenter(shapes);
        this.zoomOutToFitRoute(shapes);
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
        return setContext(MapController.KEY, new MapController());
    }
    public static getMapControllerContext = () => {
        return getContext<ReturnType<typeof this.setMapControllerContext>>(MapController.KEY);
    }
}