
import { EventMsgSchemaDGOAi } from "../../schemas";
import { IHttpSender } from "../http/IHttpSender";
import { ModelType } from "../repository/ModelType";
import { USER_AGENT } from "../repository/UserAgent";
import { EventStreamDGOAi } from "../utils/EventStream";



export class DialogManager {
    httpClient: IHttpSender
    modelType: ModelType
    chatStore: object
    _eventStreamHelp: EventStreamDGOAi

    constructor(httpClient: IHttpSender, modelType: ModelType) {
        this.httpClient = httpClient
        this.modelType = modelType
        this.chatStore = []
        this._eventStreamHelp = new EventStreamDGOAi()
    }

    async sendMessageChat(body: string, stream: boolean): Promise<typeof EventMsgSchemaDGOAi._output[]> {
        const vqdCode = await this._getVqdCode();

        const sendMsg = await this.httpClient.post('https://duckduckgo.com/duckchat/v1/chat', {
            'accept': 'text/event-stream',
            'x-vqd-4': vqdCode,
            'user-agent': USER_AGENT,
        }, {
            "model": this.modelType,
            "messages": [{"role":"user","content":body}]
        },true);

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
                return resolve(listOfSchemas);
            })

            streamBody.on('error', (error: any) => {
                reject(error);
            });
        })

    }

    async _getVqdCode(): Promise<string|null> {
        const res = await this.httpClient.get('https://duckduckgo.com/duckchat/v1/status', {
            'x-vqd-accept': '1',
            'user-agent': USER_AGENT
        });

        if(res.status === 200 && res.headers['x-vqd-4'] != null){
            return res.headers['x-vqd-4'];
        }

        return null;
    }
}