#!/usr/bin/env node
import { Command } from "commander";
import inquirer from "inquirer";
import { input } from '@inquirer/prompts';
import DialogManager from "./core/service/DialogManager";
import { getModelTypeFromString, ModelType } from "./core/repository/ModelType";

const availableModels = [
    'gpt-4o-mini',
    'meta-llama/Llama-3.3-70B-Instruct-Turbo',
    'claude-3-haiku-20240307',
    'mistralai/Mixtral-8x7B-Instruct-v0.1'
]

const program = new Command()

program
.name('dgai-cli')
.version('1.0.0')
.description('A CLI tool for working with duckduckgoai-js')
.action(async (options) => {
    console.log(`\x1b[32m DuckDuckGoAI-JS CLI Tool \x1b[0m`)
    console.log(`\x1b[34m Use CTRL + C to exit... \x1b[0m\n`)

    const model = await inquirer.prompt([
        {
            type: 'list',
            name: 'model',
            message: 'Select AI model:',
            choices: availableModels,
            default: 'GPT-4'
        }
    ]);

    const dialogManager = new DialogManager(getModelTypeFromString(model.model))
    while(true){
        const chatMsg = await input({message: 'Write message: '})
        const res = await dialogManager.sendMessageChat(chatMsg, false)
        console.log("\x1b[32m Result: \x1b[0m" + res.message)
    }

})

program.parse(process.argv)