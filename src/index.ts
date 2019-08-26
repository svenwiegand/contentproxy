import fetch from 'node-fetch'
import Mercury from '@postlight/mercury-parser'

interface RequestEvent {
    queryStringParameters: {
        url: string,
        cookie: string | undefined
    }
}

export const handler = async (event: RequestEvent): Promise<any> => {
    const url = event.queryStringParameters.url
    const cookie = event.queryStringParameters.cookie
    const headers = cookie ? { Cookie: cookie } : undefined
    const response = await fetch(url, { headers: headers })
    const contentType = response.headers.get('Content-Type')
    const isHtml = contentType !== null && contentType.toLowerCase().includes('html')
    const content = await response.text()
    const body = isHtml ? (await Mercury.parse(url, { html: content })).content : content
    return {
        isBase64Encoded: false,
        statusCode: 200,
        headers: {
            'Content-Type': contentType
        },
        body: body
    }
}