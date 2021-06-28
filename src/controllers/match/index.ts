const { Telegraf } = require('telegraf')
const keyboards = require('../../util/keyboards')
const texts = require('../../util/texts')

const matchSceneHandler = Telegraf.on('text', async (ctx: any) => {
    if (ctx.update.message.text.toLowerCase() === 'согласен') {
        await ctx.reply(texts.matchingPair)
    } else {
        await ctx.reply(texts.needWriteAgree)
    }
})

export default matchSceneHandler
