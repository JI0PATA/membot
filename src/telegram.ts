const { Telegraf } = require('telegraf')
import * as dotenv from 'dotenv'

dotenv.config()

const bot = new Telegraf(process.env.TELEGRAM_TOKEN, {})
export default bot
