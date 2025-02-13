


export interface IHttpSender {
    client: any,
    get(url: string, headers: object,...params: any): Promise<Response>,
    post(url: string, body: object, headers: object, stream: boolean, ...params: any): Promise<Response>,
    put(url: string, headers: object,...params: any): Promise<Response>,
    delete(url: string, headers: object,...params: any): Promise<Response>,
    setProxy(proxyUrl: string): void,
}

export class Response {
    status: number
    body: Record<any, any>
    headers: Record<any, any>

    constructor(status: number, body: object, headers: Record<any, any>) {
        this.status = status;
        this.body = body;
        this.headers = headers;
    }
}