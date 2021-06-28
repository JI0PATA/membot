const { Telegraf } = require('telegraf')
const keyboards = require('../../util/keyboards')
const texts = require('../../util/texts')

const genderSceneHandler = Telegraf.on('text', async (ctx: any) => {
    const gender = ctx.update.message.text

    if (gender === texts.maleButton || gender === texts.femaleButton) {
        ctx.scene.state.gender = gender

        await ctx.reply(texts.selectAge, keyboards.removeMarkup(ctx))

        return ctx.wizard.next()
    } else {
        await ctx.reply(texts.clickToButtons)
    }
})

export default genderSceneHandler
