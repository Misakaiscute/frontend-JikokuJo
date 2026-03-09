export default class Api {
    public static readonly api: string =
        import.meta.env.VITE_API_PROTOCOL + "://" +
        import.meta.env.VITE_API_HOST + ':' +
        import.meta.env.VITE_API_PORT + '/' +
        import.meta.env.VITE_API_SUFFIX + '/';

    private constructor() {}
}