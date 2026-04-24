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

window.Echo = new Echo({
    broadcaster: "reverb",
    key: import.meta.env.VITE_REVERB_KEY,
    wsHost: import.meta.env.VITE_REVERB_HOST,
    wsPort: import.meta.env.VITE_REVERB_PORT,
    enabledTransports: ["ws"],
    forceTLS: false,
    authorizer: (channel, options) => {
        return {
            authorize: (socketId, callback) => {
                axios.post("/api/broadcasting/auth", {
                    socket_id: socketId,
                    channel_name: channel.name
                }).then((response) => {
                    callback(null, response.data);
                }).catch((error) => {
                    callback(error, null);
                });
            }
        }
    }
});