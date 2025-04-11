import { webcrypto } from "crypto"
import { UA_BRANDS, USER_AGENT } from "../repository/UserAgent"
import { BASE_64, SHA_256 } from "../repository/Regex"
import { JSDOM } from 'jsdom';
import { Deobfuscator } from "deobfuscator";


export const extractData = async (data: string): Promise<object> => {
    // Просто заберите у меня компьютер чтобы я такое не писал...
    let decodedData = Buffer.from(data, 'base64').toString('utf-8')
   
    const deobf = new Deobfuscator()


    decodedData = await deobf.deobfuscateSource(decodedData, {
        
    })
    
    const matchChallengeId = decodedData.match(SHA_256)
    let challengeId: string | null = null
    if(matchChallengeId){
        challengeId = matchChallengeId[0]
        decodedData = decodedData.replace(SHA_256, '')
    }

    const matchServerHash = decodedData.match(BASE_64)
    let serverHash: string[] | null = null 
    if(matchServerHash){
        serverHash = matchServerHash.map(a => {
            return a.replace(`"`, ``).replace(`'`, ``).replace(`'`, ``)
        })
    }

    const number = +decodedData.split('String(')[1].split('+')[0]


    const dom = new JSDOM(`<!DOCTYPE html><html><body></body></html>`);
    const window = dom.window;
    const document = window.document;
    const htmlString = '<' + decodedData.split("'<")[1].split("'")[0]

    const _0xc084de = document.createElement('div');
    _0xc084de.innerHTML = htmlString



    const client_hashes: string[] = [
        USER_AGENT + UA_BRANDS,
        (number + _0xc084de.innerHTML.length * _0xc084de.querySelectorAll('*').length) + ''
    ]


    return {
        server_hashes: serverHash,
        client_hashes: await Promise.all(client_hashes.map(async hash => {
            const data = new TextEncoder().encode(hash)
            const hashBuff = await webcrypto.subtle.digest('SHA-256', data)
            return Buffer.from(hashBuff).toString('base64')
        })),
        signals: {},
        // Meta* запрещенная организация в РФ
        meta: {
            v: '1',
            challenge_id: challengeId,
            origin: 'https://duckduckgo.com',
            stack: `Error\nat ke (https://duckduckgo.com/dist/wpm.chat.227034fa144d75d4af83.js:1:30090)\nat async dispatchServiceInitialVQD (https://duckduckgo.com/dist/wpm.chat.227034fa144d75d4af83.js:1:45640)`,
        },

    }

}


export const getClientHash = async (vqdHash1: string) => {
    const a = await extractData(vqdHash1)

    return Buffer.from(JSON.stringify({
        ...a,
    })).toString('base64') 
}