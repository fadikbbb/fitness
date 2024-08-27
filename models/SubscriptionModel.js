const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        plan: {
            type: String,
            enum: ['monthly', 'yearly'],
            required: true
        },
        status: {
            type: String,
            enum: ['active', 'expired', 'canceled'],
            default: 'active'
        },
        startDate: {
            type: Date,
            default: Date.now,
            required: true
        },
        endDate: {
            type: Date,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        updatedAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

const Subscription = mongoose.model('Subscription', subscriptionSchema);

module.exports = Subscription;
