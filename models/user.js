const mongoose = require(`mongoose`);

const userSchema = new mongoose.Schema(
    {
        user_id: {
            type: Number,
            required: true,
            unique: true,
        },
        banned_by: {
            type: Number,
            required: true,
        },
        reason: {
            type: String,
        },
    },
    { timestamps: true },
);

const User = mongoose.model(`User`, userSchema);
module.exports = User;
