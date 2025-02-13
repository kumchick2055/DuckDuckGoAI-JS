
import { EventMsgSchemaDGOAi, MessagesSchemaDGOAi } from "../../schemas";
import { IHttpSender } from "../http/IHttpSender";
import { ModelType } from "../repository/ModelType";
import { USER_AGENT } from "../repository/UserAgent";
import { EventStreamDGOAi, getFullMsgFromEventStreamList } from "../utils/EventStream";
import { IChatBotResponse } from "./IChatBotResponse";


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



export class DialogManager {
    httpClient: IHttpSender
    modelType: ModelType
    chatStore: typeof MessagesSchemaDGOAi._output[]
    _vqdCode: string | null
    _eventStreamHelp: EventStreamDGOAi

    constructor(httpClient: IHttpSender, modelType: ModelType) {
        this.httpClient = httpClient
        this.modelType = modelType
        this.chatStore = []
        this._vqdCode = null
        this._eventStreamHelp = new EventStreamDGOAi()
    }

    async sendMessageChat(body: string, stream: boolean): Promise<IChatBotResponse> {
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
            'x-vqd-4': this._vqdCode,
            'user-agent': USER_AGENT,
        }, {
            "model": this.modelType,
            "messages": this.chatStore
        }, true);

        this._vqdCode =  sendMsg.headers['x-vqd-4'];

        const streamBody = sendMsg.body;
        const listOfSchemas: typeof EventMsgSchemaDGOAi._output[] = [];

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
            'x-vqd-accept': '1',
            'user-agent': USER_AGENT
        });

        if(res.status === 200 && res.headers['x-vqd-4'] != null){
            this._vqdCode = res.headers['x-vqd-4']; 
        }

 
    }
}