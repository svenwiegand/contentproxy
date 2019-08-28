export interface LambdaResult {
    isBase64Encoded: boolean,
    statusCode: number,
    headers: { [key: string]: string } | undefined,
    body: string
}