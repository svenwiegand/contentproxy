import {Beautifier} from './beautifier'

export const general: Beautifier = ($: CheerioStatic) => {
    const strong = $('<strong></strong>')
    $('subtitle').contents().wrap(strong)
}