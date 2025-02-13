import "reflect-metadata"

import { DialogManager } from "./core/service/DialogManager";
import { AxiosHttpSender } from "./core/http/AxiosHttpSender";
import { ModelType } from "./core/repository/ModelType";


async function main(){
    try{
        const dialogManager = new DialogManager(new AxiosHttpSender(), ModelType.GPT4oMini);
        let result = await dialogManager.sendMessageChat("Привет братишка!", false);

        console.log(result.message);

        result = await dialogManager.sendMessageChat("Когда был создан электровоз ВЛ80?", false);

        console.log(result.message);
    } catch(err){
        console.error(err);
    }
}

main();
