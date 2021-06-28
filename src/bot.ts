const { Telegraf, session } = require('telegraf')
const WizardScene = require('telegraf').Scenes.WizardScene
const Stage = require('telegraf').Scenes.Stage
const keyboards = require('./util/keyboards')
const texts = require('./util/texts')
import bot from './telegram'

const db = require('./db')

import startSceneHandler from "./controllers/start"
import genderSceneHandler from "./controllers/gender"
import ageSceneHandler from './controllers/age'
import ratesSceneHandler from './controllers/rates'
import pdSceneHandler from "./controllers/pd"
import matchSceneHandler from "./controllers/match"
import repeatMatchMessage from "./controllers/match/repeatMatchMessage";

import User from './models/User'

const baseScene = new WizardScene('baseScene', startSceneHandler, genderSceneHandler, ageSceneHandler, ratesSceneHandler, pdSceneHandler, matchSceneHandler)
baseScene.enter(async (ctx: any) => {
    await ctx.reply(texts.start, keyboards.agreeMarkup(ctx))
})

const stage = new Stage([ baseScene ])
stage.hears('/exit', (ctx: any) => ctx.scene.leave())

bot.use(session(), stage.middleware())
bot.start((ctx: any) => {
    if (!ctx.update.message.from.username)
        ctx.reply(texts.needSetUsername)

    ctx.scene.enter('baseScene')
})
bot.on('text', (ctx: any) => {
    User.findOne({
        id: ctx.update.message.from.id
    }, (err: any, findUser: any) => {
        if (findUser.partner) {
            return repeatMatchMessage(ctx, findUser)
        } else {
            ctx.scene.enter('baseScene')
        }
    })


})


// ==============================

// bot.start((ctx) => {
//     const user = ctx.update.message.from
//
//     // Удаление пользователя, если он существует уже в боте при старте
//     User.deleteMany({
//         id: ctx.update.message.from.id
//     }, (err) => {
//         User.create({
//             id: user.id,
//             user,
//             step: 0,
//             rates: [],
//             gender: 0,
//             partner: null,
//             agreePD: null
//         }, (err) => {
//             ctx.reply(`
//                 Привет! Это бот для знакомств! Мы подберем тебе пару, исходя из твоих мемных предпочтений! Внимание! Используй бот, только если тебе больше 18-ти лет!
//                 `, Markup
//                 .keyboard([
//                     ['Я подтверждаю, что мне большое 18-ти лет!'],
//                 ])
//                 .oneTime()
//                 .resize()
//             )
//         })
//     })
//
// })
//
// bot.hears('Я подтверждаю, что мне большое 18-ти лет!', (ctx) => {
//     const user = ctx.update.message.from
//     User.updateOne({id: user.id}, {
//         step: 1
//     })
//
//     ctx.reply('Супер! Теперь укажи свой пол!', Markup
//         .keyboard([
//             ['Мужской', 'Женский'],
//         ])
//         .oneTime()
//         .resize()
//     )
// })
//
// bot.hears('Мужской', setGender)
// bot.hears('Женский', setGender)
//
// function setGender(ctx) {
//     const user = ctx.update.message.from
//
//     User.updateOne({id: user.id}, {
//         step: 2,
//         gender: ctx.update.message.text === 'Мужской' ? 0 : 1
//     }, (err, user) => {
//         ctx.reply(`Отлично! А теперь напиши свой возраст`, Markup
//             .keyboard([
//                 []
//             ])
//         )
//     })
// }
//
// // Проверка на возраст
// bot.on('text', async (ctx) => {
//     await checkAge(ctx)
//     await rateMemes(ctx)
//     await agreePD(ctx)
//     await checkAgreePD(ctx)
//     User.findOne({id: ctx.update.message.from.id}, (err, user) => {
//         console.log(user)
//     })
// })
//
// async function checkAgreePD(ctx) {
//     const user = await User.findOne({id: ctx.update.message.from.id}, async (err, user) => {
//         if (user.step === 9 && ctx.update.message.text === 'Согласен') {
//             ctx.reply(`Я подобрал тебе идеальный мемный метч – такую пару сложно подобрать случайно, возможно, это судьба.
//
// Вот она - @katya1936
//
// Только помни о правилах приличия ;)
//
// И вдруг вы вместе захотите потом посмотреть сериал «Готовы на всё», который будет сегодня на СТС в 19:00`)
//         }
//     })
// }
//
// async function agreePD(ctx) {
//     const user = await User.findOne({id: ctx.update.message.from.id}, async (err, user) => {
//         if (user.step === 8) {
//             await User.updateOne({id: ctx.update.message.from.id}, {
//                 step: 9
//             }, async (err, doc) => {
//                 // mongoose.disconnect()
//             })
//             await ctx.reply(`Сейчас я подбираю тебе пару. Пока я это делаю, подтверди что ты согласен на обработку персональных данных. Напиши «Согласен»`)
//         }
//     })
// }
//
// function checkAge(ctx) {
//     const user = User.findOne({id: ctx.update.message.from.id}, (err, user) => {
//         const age = Number(ctx.update.message.text)
//
//         if (user.step === 2) {
//             if (!isNaN(age)) {
//                 if (age < 18) {
//                     ctx.reply('Прости Наши знакомства только для тех, кому больше 18')
//                 } else {
//                     User.updateOne({id: user.id}, {
//                         step: 3
//                     }, (err, user) => {
//                         ctx.reply('Поехали! Оцени этот мем по шкале от 1 до 5')
//                         ctx.replyWithPhoto({source: './images/mem1.png'})
//                     })
//                 }
//             } else {
//                 ctx.reply('Что-то не понимаю. Напиши свой возраст')
//             }
//         }
//     })
// }
//
// async function rateMemes(ctx) {
//     const user = await User.findOne({id: ctx.update.message.from.id}, async (err, user) => {
//         const rate = Number(ctx.update.message.text)
//
//         if (user.step >= 3 && user.step <= 7) {
//             if (!isNaN(rate)) {
//                 if (rate < 1 || rate > 5) {
//                     ctx.reply('Отправь мне число от 1 до 5, где 1 - совсем не смешно, а 5 - "ахахахах" - в голос')
//                 } else {
//                     const rates = user.rates
//
//                     rates.push(rate)
//
//                     User.updateOne({id: user.id}, {
//                         step: user.step + 1,
//                         rates: rates
//                     }, async (err) => {
//                         let answer
//                         if (user.step >= 3) {
//                             if (rate === 1) answer = 'Понял! А по-моему смешной'
//                             else if (rate === 2) answer = 'А мне кажется смешно'
//                             else if (rate === 3) answer = 'Мне тоже нравится'
//                             else if (rate === 4) answer = 'Неплохо'
//                             else if (rate === 5) answer = 'Согласен!'
//                         }
//                         if (answer.length) {
//                             await ctx.reply(answer)
//                         }
//                         if (user.step <= 6) {
//                             await ctx.reply('Поехали! Оцени этот мем по шкале от 1 до 5')
//                             await ctx.replyWithPhoto({source: `./images/mem${user.step - 1}.png`})
//                         }
//                     })
//                 }
//             } else {
//                 ctx.reply('Что-то не понимаю тебя, отправь мне число от 1 до 5, где 1 - совсем не смешно, а 5 - "ахахахах" - в голос')
//             }
//         }
//     })
// }
//
// bot.launch() // запуск бота
