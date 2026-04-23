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
        wsPort: import.meta.env.VITE_REVERB_PORT,
        enabledTransports: ["ws"],
        forceTLS: false,
        authorizer: (channel) => {
            return {
                authorize: (socketId, callback) => {
                    const token = getCookie("XSRF-TOKEN");

                    const body = new URLSearchParams({
                        socket_id: socketId,
                        channel_name: channel.name,
                    });

                    console.log("CUSTOM AUTHORIZER HIT", {
                        socketId,
                        channel: channel.name,
                    });

                    axios.post(
                        "/api/broadcasting/auth-debug",
                        body,
                        {
                            withCredentials: true,
                            headers: {
                                Accept: "application/json",
                                "X-Requested-With": "XMLHttpRequest",
                                "X-XSRF-TOKEN": token,
                                "Content-Type": "application/x-www-form-urlencoded",
                            },
                        }
                    ).then((response) => {
                        console.log("CUSTOM AUTHORIZER OK", response.status, response.data);
                        callback(null, response.data);
                    }).catch((error) => {
                        console.log("CUSTOM AUTHORIZER ERROR", error?.response?.status, error?.response?.data, error);
                        callback(error, null);
                    });
                }
            };
        }
    });
}

initEcho();