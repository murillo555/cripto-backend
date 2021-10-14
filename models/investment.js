const { Schema, model } = require('mongoose')

const InvestmentSchema = Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    investment: {
        type: Number,
        required: [true, "Investment Value is required"]
    },
    currency: {
        type: Schema.Types.ObjectId,
        ref: 'Currency',
    },
    monthly: {
        type: Number,
        required: [true, "The monthly gain is required"]
    },
    semiAnnual: {
        type: Number,
        required: [true, "The semi-anual gain is required"]
    },
    anual: {
        type: Number,
        required: [true, "The anual gain is required"]
    }
})

InvestmentSchema.methods.toJSON = function() {
    const { __v, ...investment } = this.toObject()
    return investment
}

module.exports = model('Investment', InvestmentSchema)