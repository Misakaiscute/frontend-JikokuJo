const api: string =
    import.meta.env.VITE_API_PROTOCOL + "://" +
    import.meta.env.VITE_API_HOST + ':' +
    import.meta.env.VITE_API_PORT;

export default api;