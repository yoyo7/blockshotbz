import * as mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
    item: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    sellbuy: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    amountnotfulfilled: {
        type: Number,
        required: true
    },
    fulfilled: {
        type: Boolean,
        required: false
    }
})

const ordermodel = mongoose.model('Orders', OrderSchema)
export { ordermodel }
