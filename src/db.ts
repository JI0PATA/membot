import mongoose from "mongoose";
import bot from "./telegram";
import User from './models/User'

mongoose.connect(`${process.env.DATABASE_PATH}:${process.env.DATABASE_PORT}/${process.env.DATABASE_HOST}`,
    {
        useUnifiedTopology: true,
        useNewUrlParser: true
    })

mongoose.connection.on('error', err => {
    process.exit(1)
})

mongoose.connection.on('open', _ => {
    bot.launch()
})

module.exports = mongoose
