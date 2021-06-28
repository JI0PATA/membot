const { Telegraf } = require('telegraf')
const keyboards = require('../../util/keyboards')
const texts = require('../../util/texts')

const startSceneHandler = Telegraf.on('text', async (ctx: any) => {
    if (ctx.update.message.text !== texts.agreeFirst) {
        await ctx.reply(texts.clickToButtons, keyboards.agreeMarkup(ctx).agreeButton)
    } else {
        await ctx.reply(texts.selectGender, keyboards.genderMarkup(ctx))

        return ctx.wizard.next()
    }
})

export default startSceneHandler
