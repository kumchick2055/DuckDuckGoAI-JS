import { Command } from "commander";


const program = new Command()

program
.version('1.0.0')
.description('A CLI tool for working with duckduckgoai-js')
.option('-m, --model <model>', 'AI model for communication')
.action((options) => {
    console.log(`Current AI model:, ${options.name}`);
})

program.parse(process.argv)