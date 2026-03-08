import type QueryablesRepository from "./queryablesRepository.ts";
import type {Queryable} from "../model/queryable.ts";
import Api from "../../../core/data/remote/api.ts";
import type {RootResponse} from "../../../core/data/remote/apiResponseStructure.ts";
import type {GetQueryablesObj} from "../remote/apiResponseStructure.ts";
import type {ApiResult} from "../../../core/data/remote/apiResult.ts";

export default class QueryablesRepositoryImpl implements QueryablesRepository {
    private readonly url: string = Api.api + "queryables";

    public queryables: ApiResult<Queryable[] | null> | null = null;

    async getQueryables(): Promise<void> {
        try {
            const response = await fetch(this.url);
            const body = await response.json() as RootResponse<GetQueryablesObj>;
            if (!response.ok) {
                this.queryables = {
                    kind: "reject",
                    data: null,
                    errors: body.errors
                }
            } else {
                const fetchedQueryables: Queryable[] = [];
                fetchedQueryables.push(...body.data.stops);
                fetchedQueryables.push(...body.data.routes);

                this.queryables = {
                    kind: "fulfill",
                    data: fetchedQueryables,
                    errors: []
                }
            }
        } catch {
            this.queryables = {
                kind: "reject",
                data: null,
                errors: ["Valami hiba történt."]
            }
        }
    }
}