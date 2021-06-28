import mongoose, { Document } from 'mongoose'

export interface IUser extends Document {
    id: string
    chatId: string
    user: {}
    rates: []
    age: number
    gender: number
    partner: number
    agreePD: number
}

export const UserSchema = new mongoose.Schema(
    {
        id: {
            type: String,
            required: true
        },
        chatId: {
            type: String,
            required: true
        },
        user: {
            type: Object,
            required: true
        },
        rates: {
            type: Array,
            default: []
        },
        age: Number,
        gender: Number,
        partner: {
            type: Number
        },
        agreePD: Number
    }
)

const User = mongoose.model('User', UserSchema)

export default User
