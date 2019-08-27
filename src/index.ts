import fetch from 'node-fetch'
import Mercury, { ParseResult } from '@postlight/mercury-parser'
import {LambdaResult} from './aws/lambda'

interface RequestEvent {
    queryStringParameters: {
        url: string,
        cookie: string | undefined
    }
}

const userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1'

export const handler = (event: RequestEvent): Promise<LambdaResult> => {
    const url = event.queryStringParameters.url
    const cookie = event.queryStringParameters.cookie
    const headers = { 'User-Agent': userAgent, Cookie: cookie }
    return Mercury
        .parse(url, { headers })
        .then(result => buildLambdaResult(result))
}

function buildLambdaResult(parseResult: ParseResult): LambdaResult {
    return {
        isBase64Encoded: false,
        statusCode: 200,
        headers: {
            'Content-Type': 'text/html; charset=utf-8'
        },
        body: buildHtml(parseResult)
    }
}

function buildHtml(parseResult: ParseResult): string {
    const metaTag = (name: string, content: string | null): string =>
        content ? `<meta name="${name}" content="${content.replace('"', "'")}">` : ''

    const titleTag = parseResult.title ? `<title>${parseResult.title}</title>` : ''
    const metaAuthor = metaTag('author', parseResult.author)
    const metaDate = metaTag('date', parseResult.date_published)
    const metaDescription = metaTag('description', parseResult.excerpt)
    const metaImage = metaTag('twitter:image', parseResult.lead_image_url)

    return `<!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            ${titleTag}
            ${metaAuthor}
            ${metaDate}
            ${metaDescription}
            ${metaImage}
        </head>
        <body>${parseResult.content}</body>
        </html>`
}