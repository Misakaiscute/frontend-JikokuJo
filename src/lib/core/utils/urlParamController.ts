import {Browser} from "leaflet";
import win = Browser.win;

export default class URLParamController {
    public static set = (key: string, value: string): void => {
        const url = new URLSearchParams(window.location.search);
        url.set(key, value);
        this.replaceURL(url.toString());
    }

    public static get = (param: string): string | null => {
        const url = new URLSearchParams(window.location.search);
        return url.get(param) ?? null;
    }

    public static remove = (param: string): void => {
        const url = new URLSearchParams(window.location.search);
        url.delete(param);
        this.replaceURL(url.toString());
    }

    public static purge = () => {
        this.replaceURL("");
    }

    public static contains = (param: string): boolean => {
        const url = new URLSearchParams(window.location.search);
        return url.has(param);
    }

    private static replaceURL = (newURL: string) => {
        if (newURL === ""){
            window.history.replaceState({}, "",  newURL);
        } else {
            window.history.replaceState({}, "", '?' + newURL);
        }
    }
}