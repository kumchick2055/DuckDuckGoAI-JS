export enum ModelType {
    GPT4oMini = 'gpt-4o-mini',
    LLama3370B = 'meta-llama/Llama-3.3-70B-Instruct-Turbo',
    Claude3Haiku = 'claude-3-haiku-20240307',
    Mistral8x7B = 'mistralai/Mixtral-8x7B-Instruct-v0.1'
}

export const FE_VERSION = 'serp_20250410_071825_ET-227034fa144d75d4af83'


export function getModelTypeFromString(modelStr: string): ModelType {
    const model = Object.values(ModelType).find(value => value === modelStr);
    if (!model) {
        throw new Error(`Invalid model type: ${modelStr}`);
    }
    return model;
}