

import  DialogManager  from "./core/service/DialogManager";
import { ModelType } from "./core/repository/ModelType";



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
