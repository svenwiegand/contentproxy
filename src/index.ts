import {general} from './beautify/general'
import {load} from 'cheerio'
import {fetchParser} from './parser/fetch'
import {mercuryParser} from './parser/mercury'
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
    return parser(url, cookie)
        .then(html => beautify(url, html))
        .then(buildLambdaResult)
}

function beautify(url: string, html: string): string {
    const $ = load(html)
    general($)
    if (url.includes('www.gruene.de')) {
        const imgUrl = $('header img').attr('src')
        $('meta[property="og:image"]').attr('content', imgUrl)
    }
    const beautifiedHtml = $.root().html()
    return beautifiedHtml ? beautifiedHtml : html
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