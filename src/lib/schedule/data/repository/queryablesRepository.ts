import type {Queryable} from "../model/queryable.ts";
import type {ApiResult} from "../../../core/data/remote/apiResult.ts";

export default interface QueryablesRepository {
    queryables: ApiResult<Queryable[] | null> | null;

    getQueryables(): Promise<void>;
}