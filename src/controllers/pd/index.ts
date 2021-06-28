const { Telegraf } = require('telegraf')
const keyboards = require('../../util/keyboards')
const texts = require('../../util/texts')
import matchingProcess from "../match/matching";

const pdSceneHandler = Telegraf.on('text', async (ctx: any) => {
    if (ctx.update.message.text.toLowerCase() !== 'согласен') {
        return await ctx.reply(texts.needWriteAgree)
    }

    return matchingProcess(ctx)
})

export default pdSceneHandler
