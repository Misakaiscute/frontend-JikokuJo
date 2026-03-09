export type ApiResult<T> = {
    kind: "fulfill" | "reject",
    data: T,
    errors: string[] | null
}