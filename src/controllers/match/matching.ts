const { Telegraf } = require('telegraf')
const keyboards = require('../../util/keyboards')
const texts = require('../../util/texts')

import User from './../../models/User'

import bot from './../../telegram'

const matchingProcess = async (ctx: any) => {
    await ctx.reply(texts.matchingPair)

    const userCtx = ctx.update.message.from

    // Удаление пользователя, если он уже есть в базе, только для дебага
    await User.deleteMany({
        id: userCtx.id
    })

    await User.create({
        id: userCtx.id,
        chatId: ctx.update.message.chat.id,
        user: userCtx,
        rates: ctx.scene.state.rates,
        gender: ctx.scene.state.gender.toLowerCase() === 'мужской' ? 0 : 1,
        partner: null,
        agreePD: new Date().getTime()
    })

    let isFind = false
    let rates = [...ctx.scene.state.rates]
    let resultRates = [...ctx.scene.state.rates]
    let indexRate = 0
    let iterate = 0
    let usersCount: number = 0
    let dir = true

    let user: any

    await User.findOne({
        id: userCtx.id
    }, (err: any, u: any) => {
        user = u
    })

    await User.countDocuments({
        id: { $ne: user.id },
        gender: user.gender === 0 ? 1 : 0,
        agreePD: { $ne: null },
        partner: null
    }, (err, count) => {
        usersCount = count
    })

    setTimeout(_ => {
        isFind = true
    }, 1000)

    while (!isFind) {
        if (iterate >= usersCount) {
            return isFind = true
        }

        let findUser: any

        await User.findOne({
            rates: resultRates,
            id: { $ne: user.id },
            gender: user.gender === 0 ? 1 : 0,
            agreePD: { $ne: null },
            partner: null
        }, async (err: any, fUser: any) => {
            findUser = fUser
        })

        if (findUser) {

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
                return bot.telegram.sendMessage(findUser.chatId, texts.matchedPair.replace(/%1/, `@${ownUser.user.username}`))
            })

            return isFind = true
        }
        else {
            if (dir) {
                if (resultRates[indexRate] < 5) {
                    resultRates[indexRate] = resultRates[indexRate] + 1
                } else {
                    dir = false
                }
            } else {
                if (resultRates[indexRate] > 1) {
                    resultRates[indexRate] = resultRates[indexRate] - 1
                } else {
                    resultRates[indexRate] = rates[indexRate]
                    indexRate++
                    dir = true
                }
            }

            if (indexRate >= rates.length - 1) {
                console.log('new user')
                iterate++
                indexRate = 0
                resultRates = rates
            }
        }
    }
}

export default matchingProcess
