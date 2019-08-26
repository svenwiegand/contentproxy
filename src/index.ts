import fetch from 'node-fetch'

interface RequestEvent {
    queryStringParameters: {
        url: string
    },
    multiValueQueryStringParameters: {
        cookie: Array<string> | undefined
    }
}

export const handler = async (event: RequestEvent): Promise<any> => {
    const url = event.queryStringParameters.url
    const response = await fetch(url)
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