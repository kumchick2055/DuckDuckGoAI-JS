import { EventMsgSchemaDGOAi } from "../../schemas.ts";
import { REGEX_JSON } from "../repository/Regex.ts";


export class EventStreamDGOAi {
    parsePayload(payload: string): typeof EventMsgSchemaDGOAi._output[]  {

        const listOfSchemas: typeof EventMsgSchemaDGOAi._output[] = [];

        // Разделяем строку
        const jsonData: string = payload.split('data: ').splice(1).join('');

        // Берём все json из содержимого
        const matches = jsonData.match(REGEX_JSON);


        if(matches){
            const jsonObjects = matches.map((data: string) => {
                try{
                    const a = JSON.parse(data);
                    const parsedSchema = EventMsgSchemaDGOAi.safeParse(a);
                    
                    return parsedSchema;
                } catch(err){
                    return null;
                }
            }).filter(obj => obj !== null); 

            
            jsonObjects.forEach(data => {

                if(data.success)
                    listOfSchemas.push(data.data);
            })

        }

        if(listOfSchemas.length > 0){
            return listOfSchemas;
        }

        return [];

    }
}

export const getFullMsgFromEventStreamList = (dataList: typeof EventMsgSchemaDGOAi._output[] ): string => {
    let botMsg = '';

    dataList.forEach(data => {
        botMsg += data.message;
    })

    return botMsg;
};