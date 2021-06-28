import User from "../../models/User";
import bot from "../../telegram";

const { Telegraf } = require('telegraf')
const keyboards = require('../../util/keyboards')
const texts = require('../../util/texts')

const repeatMatchMessage = async (ctx: any, findUser: any) => {
    await User.findOne({
        id: findUser.partner
    }, (err: any, partnerUser: any) => {
        // Отправляем сообщение текущему пользователю о найденном совпадении
        ctx.reply(texts.matchedPair.replace(/%1/, `@${partnerUser.user.username}`))
    })
}

export default repeatMatchMessage
