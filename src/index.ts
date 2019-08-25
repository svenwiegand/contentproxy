interface RequestEvent {
    queryStringParameters: {
        url: string
    },
    multiValueQueryStringParameters: {
        cookie: Array<string> | undefined
    }
}

export const handler = async  (event: any = {}): Promise<any> => {
    const response = JSON.stringify(event, null, 2)
    return {
        isBase64Encoded: false,
        statusCode: 200,
        headers: {
            'Content-Type': 'text/html; charset=UTF-8'
        },
        body: '<html><head></head><body>' + event.queryStringParameters.url + '</body></html>'
    }
}