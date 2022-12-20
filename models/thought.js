const { Schema, model, Types, } = require('mongoose');

const moment = require('moment')

const reactionSchema = new Schema(
    {
        reactionId: {
            type: Schema.Types.ObjectId,
            default: () => new Types.ObjectId(),
        },

        reactionBody: { type: String, required: true, maxLength: 200},

        username: { type: String, required: true},

        dateCreated: { type: date, default: Date.now, get: dateCreatedVal => moment(dateCreatedVal).format("MMM DD, YYYY [at] hh:mm a")},
    },
    {
        toJSON: {
            virtuals: true,
            getters: true,
        },
        id: false,   
    }
)

const ThoughtSchema = new Schema(
    {
        thoughtString: { type: String, required: true, minLength: 1, maxLength: 200},

        dateCreated: { type: date, default: Date.now, get: dateCreatedVal => moment(dateCreatedVal).format("MMM DD, YYYY [at] hh:mm a")},

        username: { type: String, required: true},

        reactions: [reactionSchema],
    },
    {
        toJSON: {
            virtuals: true,
            getters: true,
        },
        id: false,   
    }
)

ThoughtSchema.virtual('reactionCount').get(function() {
    return this.reactions.length;
})

const Thought = model('Thought', ThoughtSchema);
module.exports = Thought;