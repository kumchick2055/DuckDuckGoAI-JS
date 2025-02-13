import "reflect-metadata"

import { DialogManager } from "./core/service/DialogManager";
import { AxiosHttpSender } from "./core/http/AxiosHttpSender";
import { ModelType } from "./core/repository/ModelType";


async function main(){
    try{
        
        const userPrompt = "Привет братишка!";
        const dialogManager = new DialogManager(new AxiosHttpSender(), ModelType.GPT4oMini);
        const result = await dialogManager.sendMessageChat(userPrompt, false);

        let botMsg = '';

        result.forEach(data => {
            botMsg += data.message;
        })

        console.log(botMsg);
    } catch(err){
        console.error(err);
    }
}

main();
