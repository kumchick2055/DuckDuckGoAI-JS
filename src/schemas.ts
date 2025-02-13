import {z} from 'zod';


export const EventMsgSchemaDGOAi = z.object({
    role: z.string().optional(),
    message: z.string(),
    created: z.number(),
    id: z.string(),
    action: z.string(),
    model: z.string() 
});


export const MessagesSchemaDGOAi = z.object({
    role: z.string(),
    content: z.string()
})