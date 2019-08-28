import {Parser, userAgent} from './parser'
import { parse, ParseResult } from '@postlight/mercury-parser'
import {fetchParser} from './fetch'

type ExtendedParseResult = ParseResult & { lang?: string }
const langPattern = /<html .*lang="(.*)".*>/

export const mercuryParser: Parser = (url: string, cookie?: string) => {
    const headers: HeadersInit = cookie ? { 'User-Agent': userAgent, Cookie: cookie } : { 'User-Agent': userAgent }
    return fetchParser(url, cookie)
        .then(langFrom)
        .then(lang => parse(url, { headers: headers }).then(r => extendedParseResult(r, lang)))
        .then(buildHtml)
}

function langFrom(html: string): string | undefined {
    const match = langPattern.exec(html)
    return match ? match[1] : undefined
}

function extendedParseResult(result: ParseResult, lang?: string): ExtendedParseResult {
    return { ...result, lang: lang }
}

function buildHtml(parseResult: ExtendedParseResult): string {
    const metaTag = (name: string, content: string | null): string =>
        content ? `<meta name="${name}" content="${content.replace('"', "'")}">` : ''

    const htmlTag = parseResult.lang ? `<html lang="${parseResult.lang}">` : '<html>'
    const titleTag = parseResult.title ? `<title>${parseResult.title}</title>` : ''
    const metaAuthor = metaTag('author', parseResult.author)
    const metaDate = metaTag('date', parseResult.date_published)
    const metaDescription = metaTag('description', parseResult.excerpt)
    const metaImage = metaTag('twitter:image', parseResult.lead_image_url)

    return `<!DOCTYPE html>
        ${htmlTag}
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