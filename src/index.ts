import {mercuryParser} from './parser/mercury'
import {fetchParser} from './parser/fetch'
import {Parser} from './parser/Parser'

interface RequestEvent {
    queryStringParameters: {
        cookie: string | undefined,
        parser: string | undefined,
        url: string
    }
}

export interface LambdaResult {
    isBase64Encoded: boolean,
    statusCode: number,
    headers: { [key: string]: string } | undefined,
    body: string
}

const parsers: { [key: string]: Parser | undefined } = {
    no: fetchParser,
    yes: mercuryParser,
    nop: fetchParser,
    mercury: mercuryParser,
}

function getParser(parserName?: string): Parser {
    const parser = parserName ? parsers[parserName] : undefined
    return parser ? parser : fetchParser
}

export const handler = (event: RequestEvent): Promise<LambdaResult> => {
    const url = event.queryStringParameters.url
    const cookie = event.queryStringParameters.cookie
    const parser = getParser(event.queryStringParameters.parser)
    return parser(url, cookie).then(buildLambdaResult)
}

function buildLambdaResult(html: string): LambdaResult {
    return {
        isBase64Encoded: false,
        statusCode: 200,
        headers: {
            'Content-Type': 'text/html; charset=utf-8'
        },
        body: html
    }
}