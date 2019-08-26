import fetch from 'node-fetch'

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
    const html = await response.text()
    return {
        isBase64Encoded: false,
        statusCode: 200,
        headers: {
            'Content-Type': response.headers.get('Content-Type')
        },
        body: html
    }
}