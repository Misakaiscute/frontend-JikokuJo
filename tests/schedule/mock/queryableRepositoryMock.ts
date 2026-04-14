import type QueryablesRepository from "../../../src/lib/schedule/data/repository/queryablesRepository.ts";
import type {Queryable} from "../../../src/lib/schedule/data/model/queryable.ts";

export default class QueryableRepositoryMock implements QueryablesRepository {
    private queryables: Queryable[] = [];
    constructor() {
        for (let i = 0; i < 26; i++) {
            this.queryables.push({
                kind: "stop",
                name: `Stop No. ${i}`,
                ids: [Math.round(Math.random() * 1000).toString()]
            });
            this.queryables.push({
                kind: "route",
                route_id: i.toString(),
                route_short_name: i.toString(),
                color: Math.round(Math.random() * Math.pow(2, 16)).toString(16).toString(),
                type: i % 8
            });
        }
    }

    mockGetQueryablesSuccess: boolean | null = false; //Allow variable to be null to simulate promise in the hanging state.
    getQueryables(): Promise<Queryable[]> {
        return new Promise<Queryable[]>((resolve, reject) => {
            if (this.mockGetQueryablesSuccess === null) {
                return;
            }
            else if (this.mockGetQueryablesSuccess) {
                resolve(this.queryables);
            } else {
                reject(new Error("Mock error"));
            }
        })
    }
}