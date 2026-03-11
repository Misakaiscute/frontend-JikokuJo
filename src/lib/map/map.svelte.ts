import Leaflet from "leaflet";

export default class Map{
    private readonly map: Leaflet.Map | undefined;

    constructor(mapHolderId: HTMLDivElement) {
        this.map = Leaflet.map(mapHolderId, {
            zoomControl: false,
        }).setView([47.49031325038684, 19.053912410022516], 10);

        Leaflet.control.zoom({
            position: "bottomleft"
        }).addTo(this.map);

        Leaflet.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a>"
        }).addTo(this.map);
    }
}