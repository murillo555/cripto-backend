const { Schema, model } = require('mongoose')

const CurrencySchema = Schema({
    slug: {
        type: String
    },
    symbol: {
        type: String
    },
    name: {
        type: String
    },
    investmentValue: {
        type: Number
    }
})

CurrencySchema.methods.toJSON = function() {
    const { __v, ...currency } = this.toObject()
    return currency
}

module.exports = model('Currency', CurrencySchema)