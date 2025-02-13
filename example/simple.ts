import "reflect-metadata"

import { DialogManager } from "../src/core/service/DialogManager";
import { AxiosHttpSender } from "../src/core/http/AxiosHttpSender";
import { ModelType } from "../src/core/repository/ModelType";


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
