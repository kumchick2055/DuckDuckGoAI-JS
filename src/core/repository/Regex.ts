export const REGEX_JSON = /({.*?}|[\[.*?])/g;
export const SHA_256 = /[a-f0-9]{64}\w*/;
// TODO: Fix base64 regex
export const BASE_64 = /(?:['"])([A-Za-z0-9+/]{20,}={0,2})(?:['"])/g;