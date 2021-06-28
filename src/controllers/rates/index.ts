const { Telegraf } = require('telegraf')
const keyboards = require('../../util/keyboards')
const texts = require('../../util/texts')
const fs = require('fs')

const ratesSceneHandler = Telegraf.on('text', async (ctx: any) => {
    const rate = Number(ctx.update.message.text)

    if (!ctx.scene.state?.rates?.length) ctx.scene.state.rates = []

    if (rate) {
        await ctx.reply(texts.ratesMemes[rate])
        ctx.scene.state.rates.push(rate)
    } else {
        await ctx.reply(texts.rateIncorrectValue)
    }

    if (ctx.scene.state.rates.length >= 5) {
        await ctx.reply(texts.willMatchPair)
        return ctx.wizard.next()
    } else {
        if (rate) {
            await ctx.reply(texts.startRateMemes)
            await ctx.replyWithPhoto({ source: fs.createReadStream(`dist/images/mem${ctx.scene.state.rates.length + 1}.png`) })
        } else {
            await ctx.reply(texts.rateIncorrectValue)
        }
    }
})

export default ratesSceneHandler
