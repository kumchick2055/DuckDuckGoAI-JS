

import  DialogManager  from "./core/service/DialogManager.ts";
import { ModelType } from "./core/repository/ModelType.ts";



async function main(){
    try{
        const dialogManager = new DialogManager(ModelType.GPT4oMini);
        let result = await dialogManager.sendMessageChat(`как твои дела?`);
        console.log(result.message);
        result = await dialogManager.sendMessageChat(`Как написать на питоне http запрос?`)
        console.log(result.message)
    } catch(err){
        console.error(err);
    }
}

main();
