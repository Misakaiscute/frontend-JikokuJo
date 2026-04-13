import type QueryablesRepository from "../../../src/lib/schedule/data/repository/queryablesRepository.ts";
import type {Queryable} from "../../../src/lib/schedule/data/model/queryable.ts";

export default class QueryableRepositoryMock implements QueryablesRepository {
    mockGetQueryablesSuccess: boolean | null = false; //Allow variable to be null, to simulate the hanging state, so the promise never rejects or fulfills
    getQueryables(): Promise<Queryable[]> {
        return new Promise<Queryable[]>((resolve, reject) => {
            if (this.mockGetQueryablesSuccess === null) {
                return;
            }
            else if (this.mockGetQueryablesSuccess) {
                resolve([]);
            } else {
                reject(new Error("Mock error"));
            }
        })
    }
}