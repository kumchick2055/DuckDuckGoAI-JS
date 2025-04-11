
import { EventMsgSchemaDGOAi, MessagesSchemaDGOAi } from "../../schemas.ts";
import { HttpSender } from "../http/HttpSender.ts";
import type { IHttpSender } from "../http/IHttpSender.ts";
import { FE_VERSION, ModelType } from "../repository/ModelType.ts";
import { USER_AGENT } from "../repository/UserAgent.ts";
import { getClientHash } from "../utils/ClientHash.ts";
import { EventStreamDGOAi, getFullMsgFromEventStreamList } from "../utils/EventStream.ts";
import type { IChatBotResponse }  from "./IChatBotResponse.ts";


class ChatBotResponseDGOAi implements IChatBotResponse {
    result: typeof EventMsgSchemaDGOAi._output[]

    private _message: string

    constructor(result: typeof EventMsgSchemaDGOAi._output[]) {
        this.result = result
        this._message = ''
    }

    public get message(): string {
        this._message = getFullMsgFromEventStreamList(this.result);
        return this._message;
    }
}



export default class DialogManager {
    httpClient: IHttpSender
    modelType: ModelType
    chatStore: typeof MessagesSchemaDGOAi._output[]
    _vqdCode: string | null
    _vqdHash1: string | null
    _eventStreamHelp: EventStreamDGOAi

    public eventCallback: (() => void) | null;

    constructor(modelType: ModelType) {
        this.httpClient = new HttpSender()
        this.modelType = modelType
        this.chatStore = []
        this._vqdCode = null
        this._vqdHash1 = null
        this._eventStreamHelp = new EventStreamDGOAi()
        this.eventCallback = null;
    }

    async sendMessageChat(body: string, stream: boolean = false): Promise<IChatBotResponse> {
        if(this._vqdCode === null){
            await this._getVqdCode();
        }

        const payloadMsg = MessagesSchemaDGOAi.safeParse({"role":"user","content":body});

        if(!payloadMsg.success){
            throw new Error(`Verification failed on payload Message ${payloadMsg.error}`)
        }
        this.chatStore.push(payloadMsg.data);

        const sendMsg = await this.httpClient.post('https://duckduckgo.com/duckchat/v1/chat', {
            'accept': 'text/event-stream',
            'content-type': 'application/json',
            'cookie': 'dcm=3; dcs=1',
            'origin': 'https://duckduckgo.com',
            'referer': 'https://duckduckgo.com/',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',

            'user-agent': USER_AGENT,
            'x-fe-version': FE_VERSION,
            'x-vqd-4': this._vqdCode,
            'x-vqd-hash-1': this._vqdHash1,
        }, {
            "model": this.modelType,
            "messages": this.chatStore
        }, true);


        this._vqdCode =  sendMsg.headers['x-vqd-4'];
        this._vqdHash1 = await getClientHash(sendMsg.headers['x-vqd-hash-1']); 

        const streamBody = sendMsg.body;
        const listOfSchemas: typeof EventMsgSchemaDGOAi._output[] = [];


        // if(stream){
        //     this.eventCallback();
        // }

        return new Promise((resolve, reject) => {
            streamBody.on('data', (data: any) => {
                const rawData = data.toString('utf-8');
                listOfSchemas.push(
                    ...this._eventStreamHelp.parsePayload(rawData)
                );
            });
    
            streamBody.on('end', () => {
                const botResponse: ChatBotResponseDGOAi = new ChatBotResponseDGOAi(listOfSchemas);

                const botMsgData = MessagesSchemaDGOAi.safeParse({
                    role: 'assistant',
                    content: botResponse.message
                });

                // Добавляем ответ бота в историю
                if(botMsgData.success){
                    this.chatStore.push(botMsgData.data);
                }

                return resolve(botResponse);
            })

            streamBody.on('error', (error: any) => {
                reject(error);
            });
        })

    }

    
    async _getVqdCode(): Promise<void>{
        /**
         * Получить Vqd код для общения с чат ботом
         * @returns Vqd код
         */
        const res = await this.httpClient.get('https://duckduckgo.com/duckchat/v1/status', {
            'referer': 'https://duckduckgo.com/',
            'origin': 'https://duckduckgo.com',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',

            'cookie': 'dcm=3',
            'user-agent': USER_AGENT,
            'x-vqd-accept': '1',
        });


        if(res.status === 200 && res.headers['x-vqd-4'] != null){
            this._vqdCode = res.headers['x-vqd-4']; 
            
            this._vqdHash1 = await getClientHash(res.headers['x-vqd-hash-1']); 
            console.log(this._vqdHash1)
        }

 
    }
}