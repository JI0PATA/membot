const { Telegraf } = require('telegraf')
const keyboards = require('../../util/keyboards')
const texts = require('../../util/texts')

import User from './../../models/User'

import bot from './../../telegram'

const matchingProcess = async (ctx: any) => {
    await ctx.reply(texts.matchingPair)

    const user = ctx.update.message.from

    // Удаление пользователя, если он уже есть в базе, только для дебага
    await User.deleteMany({
        id: user.id
    })

    await User.create({
        id: user.id,
        chatId: ctx.update.message.chat.id,
        user,
        rates: ctx.scene.state.rates,
        gender: ctx.scene.state.gender.toLowerCase() ? 0 : 1,
        partner: null,
        agreePD: new Date().getTime()
    })

    await User.findOne({
        rates: ctx.scene.state.rates,
        id: { $ne: user.id },
        gender: user.gender === 0 ? 1 : 0,
        agreePD: { $ne: null }
    }, async (err: any, findUser: any) => {

        // Если пользователь под подходящие критерии не найден, то выходим
        if (!findUser) return

        // обновляем текущего пользователя
        await User.updateOne({
            id: user.id
        }, {
            partner: +findUser.user.id
        })

        // Отправляем сообщение текущему пользователю о найденном совпадении
        await ctx.reply(texts.matchedPair.replace(/%1/, `@${findUser.user.username}`))

        // Обновляем найденного пользователя и присваиваем ему текущему пользователю
        await User.updateOne({
            id: findUser.id
        }, {
            partner: +user.id
        })

        // Ищем в базе текущего пользователя
        await User.findOne({
            id: user.id
        }, (err: any, ownUser: any) => {
            bot.telegram.sendMessage(findUser.chatId, texts.matchedPair.replace(/%1/, `@${ownUser.user.username}`))
        })
    })
}

export default matchingProcess
