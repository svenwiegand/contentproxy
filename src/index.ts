import {mercuryParser} from './parser/mercury'

interface RequestEvent {
    queryStringParameters: {
        url: string,
        cookie: string | undefined
    }
}

export interface LambdaResult {
    isBase64Encoded: boolean,
    statusCode: number,
    headers: { [key: string]: string } | undefined,
    body: string
}

export const handler = (event: RequestEvent): Promise<LambdaResult> => {
    const url = event.queryStringParameters.url
    const cookie = event.queryStringParameters.cookie
    return mercuryParser(url, cookie).then(buildLambdaResult)
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