import type QueryablesRepository from "./queryablesRepository.ts";
import type {Queryable, Route, Stop} from "../model/queryable.ts";
import type {RootResponse} from "../../../core/data/remote/apiResponseStructure.ts";
import type {GetQueryablesObj} from "../remote/apiResponseStructure.ts";
import type {ApiResult} from "../../../core/data/remote/apiResult.ts";
import axios, {type AxiosError} from "axios";

export default class QueryablesRepositoryImpl implements QueryablesRepository {
    private queryables: ApiResult<Queryable[] | null> | null = null;

    async getQueryables(): Promise<Queryable[]> {
        if (this.queryables !== null && this.queryables.kind === "fulfill") {
            return this.queryables.data!!;
        }
        try {
            return await axios.get<RootResponse<GetQueryablesObj>>("/api/queryables").then((res) => {
                const fetchedQueryables: Queryable[] = [];
                fetchedQueryables.push(...(res.data.data.stops).map((it: Stop): Stop => ({
                    ...it,
                    kind: "stop",
                })));
                fetchedQueryables.push(...res.data.data.routes.map((it: Route): Route => ({
                    ...it,
                    kind: "route"
                })));

                this.queryables = {
                    kind: "fulfill",
                    data: fetchedQueryables,
                    errors: []
                }
                return this.queryables.data!!;
            }).catch((err: AxiosError<RootResponse<GetQueryablesObj>>) => {
                this.queryables = {
                    kind: "reject",
                    data: null,
                    errors: err.response?.data?.errors ?? ["Valami hiba történt."]
                }
                throw new Error(this.queryables.errors[0]);
            });
        } catch (e) {
            throw new Error("Szerver nem elérhető.");
        }
    }
}