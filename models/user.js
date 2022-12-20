const { Schema, model, Types, } = require('mongoose');

const userSchema = new Schema(
    {
        username: { type: String, unique: true, required: true, trim: true },

        email: { type: String, unique: true, required: true, 
        match: [
            /^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/,
            "This email address is not valid."

            ],
        },

       thoughts: [
        {
            type: Schema.Types.ObjectId,
            ref: "Thought",
        },
       ],
       friends: [
        {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
       ],
    },
    {
        toJSON: {
            virtuals: true,
            getters: true,
        },
        id: false,   
    }
);

userSchema.virtual("friendCount").get(function() {
    return this.friends.length;
});

const User = model('User', userSchema);
module.exports = User;