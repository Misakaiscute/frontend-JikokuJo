import type QueryablesRepository from "./queryablesRepository.ts";
import type {Queryable, Route, Stop} from "../model/queryable.ts";
import Api from "../../../core/data/remote/api.ts";
import type {RootResponse} from "../../../core/data/remote/apiResponseStructure.ts";
import type {GetQueryablesObj} from "../remote/apiResponseStructure.ts";
import type {ApiResult} from "../../../core/data/remote/apiResult.ts";

export default class QueryablesRepositoryImpl implements QueryablesRepository {
    private readonly url: string = Api.api + "queryables";

    public queryables: ApiResult<Queryable[] | null> | null = null;

    async getQueryables(): Promise<void> {
        let response!: Response;
        try {
            response = await fetch(this.url);
        } catch (e) {
            throw new Error("Szerver nem elérhető.")
        }
        const body = await response.json() as RootResponse<GetQueryablesObj>;
        if (!response.ok) {
            this.queryables = {
                kind: "reject",
                data: null,
                errors: body.errors
            }
            throw new Error(this.queryables.errors?.[0] ?? "Valami hiba történt.");
        } else {
            const fetchedQueryables: Queryable[] = [];
            fetchedQueryables.push(...(body.data.stops).map((it): Stop => ({
                ...it,
                kind: "stop",
            })));
            fetchedQueryables.push(...body.data.routes.map((it): Route => ({
                ...it,
                kind: "route"
            })));

            this.queryables = {
                kind: "fulfill",
                data: fetchedQueryables,
                errors: []
            }
            return;
        }
    }
}