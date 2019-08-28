import {Parser, userAgent} from './parser'
import fetch from 'node-fetch'

export const nopParser: Parser = (url: string, cookie?: string): Promise<string> => {
    const headers: HeadersInit = cookie ? { 'User-Agent': userAgent, Cookie: cookie } : { 'User-Agent': userAgent }
    return fetch(url, { headers: headers }).then(response => response.text())
}