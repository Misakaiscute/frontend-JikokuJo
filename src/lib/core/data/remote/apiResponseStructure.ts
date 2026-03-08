export interface RootResponse<out T extends Payload>{
    data: T,
    errors: string[]
}

export interface Payload {}