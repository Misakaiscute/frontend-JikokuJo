export default class Api {
    public static readonly api: string =
        import.meta.env.API_PROTOCOL + "://" +
        import.meta.env.API_HOST + ':' +
        import.meta.env.API_PORT + '/' +
        import.meta.env.API_SUFFIX + '/';

    private constructor() {}
}