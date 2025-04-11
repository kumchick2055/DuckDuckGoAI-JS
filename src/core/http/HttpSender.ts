import axios from "axios";
import type  { AxiosInstance, ResponseType } from "axios"
import type { IHttpSender } from "./IHttpSender.ts";

import { Response } from "./IHttpSender.ts"
import { USER_AGENT } from "../repository/UserAgent.ts";
// import { gotScraping } from "got-scraping";

export class HttpSender implements IHttpSender {
    client: AxiosInstance;

    constructor(){
        
        this.client = axios.create({
            headers: {
                'user-agent': USER_AGENT
            }
        }); 
    }

    async get(url: string, headers: object, ...params: any): Promise<Response> {
        const res = await axios.get(url, {
            headers
        })

        const returnData: Response = new Response(res.status, res.data, res.headers);
        return returnData;
    }


    async post(url: string, headers: object, body: object, stream: boolean, ...params: any): Promise<Response> {
        let resType: ResponseType = 'text';
        if(stream){
            resType = 'stream';
        }

        const res = await axios.post(url, body, {
            headers,
            responseType: resType
        })

        const returnData: Response = new Response(res.status, res.data, res.headers);
        return returnData;
    }


    async put(url: string, headers: object, ...params: any):  Promise<Response> {
        const res = await axios.get(url, {
            headers
        })

        const returnData: Response = new Response(res.status, res.data, res.headers);
        return returnData;
    }


    async delete(url: string, headers: object, ...params: any):  Promise<Response> {
        const res = await axios.get(url, {
            headers
        })

        const returnData: Response = new Response(res.status, res.data, res.headers);
        return returnData;
    }

    async setProxy(proxyUrl: string): Promise<void> {
        // TODO: Сделать поддержку прокси
    }
}