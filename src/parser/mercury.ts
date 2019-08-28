import { Parser, userAgent } from './parser'
import Mercury, { ParseResult } from '@postlight/mercury-parser'

export const mercuryParser: Parser = (url: string, cookie?: string) => {
    const headers = { 'User-Agent': userAgent, Cookie: cookie }
    return Mercury
        .parse(url, { headers })
        .then(result => buildHtml(result))
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