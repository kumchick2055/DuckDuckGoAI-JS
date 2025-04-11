

import  DialogManager  from "./core/service/DialogManager.ts";
import { ModelType } from "./core/repository/ModelType.ts";



async function main(){
    try{
        const dialogManager = new DialogManager(ModelType.GPT4oMini);
        let result = await dialogManager.sendMessageChat(`как будет по испански "когда понял как курить"`);
        console.log(result.message);
        
        result = await dialogManager.sendMessageChat(`как будет по испански "привет я хочу с тобой дружить"`);
        console.log(result.message);
        
    } catch(err){
        console.error(err);
    }
}

main();
