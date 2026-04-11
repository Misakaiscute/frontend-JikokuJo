const api = (): string => {
    const protocol: string | undefined = import.meta.env.VITE_API_PROTOCOL;
    const host: string | undefined = import.meta.env.VITE_API_HOST;
    const port: string | undefined = import.meta.env.VITE_API_PORT;

    if (!protocol || !host || !port) {
        throw new Error("Incorrectly set route for the api! Please check your .env file!");
    } else {
        return `${protocol}://${host}:${port}`;
    }
}
export default api;