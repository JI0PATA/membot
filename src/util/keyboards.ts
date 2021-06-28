const Markup = require('telegraf').Markup
const texts = require('./texts')

export const genderMarkup = (ctx: any) => {
    return Markup.keyboard([texts.maleButton, texts.femaleButton]).oneTime().resize()
}

export const agreeMarkup = (ctx: any) => {
    return Markup.keyboard([texts.agreeFirst]).oneTime().resize()
}

export const removeMarkup = (ctx: any) => {
    return Markup.removeKeyboard()
}
