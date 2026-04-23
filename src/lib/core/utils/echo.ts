import axios from "axios";
import Echo from "laravel-echo";
import Pusher from "pusher-js";

declare global {
    interface Window {
        Echo: Echo<any>;
        Pusher: typeof Pusher;
    }
}

window.Pusher = Pusher;

axios.defaults.baseURL = "http://localhost:8000";
axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;
axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

function getCookie(name: string) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        return decodeURIComponent(parts.pop()!.split(";").shift()!);
    }
    return "";
}

async function initEcho() {
    await axios.get("/sanctum/csrf-cookie");
    window.Echo = new Echo({
        broadcaster: "reverb",
        key: import.meta.env.VITE_REVERB_KEY,
        wsHost: import.meta.env.VITE_REVERB_HOST,
        wsPort: Number(import.meta.env.VITE_REVERB_PORT),
        enabledTransports: ["ws"],
        forceTLS: import.meta.env.VITE_REVERB_PROTOCOL === "https",

        activityTimeout: 120000,
        pongTimeout: 30000,
        unavailableTimeout: 10000,

        authorizer: (channel) => {
            return {
                authorize: (socketId, callback) => {
                    const token = getCookie("XSRF-TOKEN");
                    const body = new URLSearchParams({
                        socket_id: socketId,
                        channel_name: channel.name,
                    });

                    axios.post("/api/broadcasting/auth", body, {
                        withCredentials: true,
                        headers: {
                            Accept: "application/json",
                            "X-Requested-With": "XMLHttpRequest",
                            "X-XSRF-TOKEN": token,
                            "Content-Type": "application/x-www-form-urlencoded",
                        },
                    }).then((response) => {
                        callback(null, response.data);
                    }).catch((error) => {
                        callback(error, null);
                    });
                }
            };
        },
    });
    const pusher = window.Echo?.connector?.pusher;

    if (pusher) {
        pusher.connection.bind("state_change", (states: { previous: string; current: string }) => {
            console.log("WS state:", states.previous, "->", states.current);
        });

        pusher.connection.bind("error", (err: unknown) => {
            console.error("WS error:", err);
        });
    }
}

initEcho();