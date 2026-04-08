export interface RootResponse<out T extends Payload>{
    data: T,
    errors: string[],
    message: string
}

export interface Payload {}