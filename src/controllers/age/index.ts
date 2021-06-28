const { Telegraf } = require('telegraf')
const keyboards = require('../../util/keyboards')
const texts = require('../../util/texts')
const fs = require('fs')

const ageSceneHandler = Telegraf.on('text', async (ctx: any) => {
    const age = Number(ctx.update.message.text)

    if (age) {
        if (age < 18) {
            await ctx.reply(texts.youngAge)
        }
        ctx.scene.state.age = age

        await ctx.reply(texts.startRateMemes)
        await ctx.replyWithPhoto({source: fs.createReadStream('dist/images/mem1.png')})

        return ctx.wizard.next()
    } else {
        await ctx.reply(texts.incorrectAge)
    }
})

export default ageSceneHandler
