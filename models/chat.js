const mongoose = require(`mongoose`);

const chatSchema = new mongoose.Schema(
    {
        chat_id: {
            type: Number,
            required: true,
            unique: true,
        },
    },
    { timestamps: true },
);

const Chat = mongoose.model(`Chat`, chatSchema);
module.exports = Chat;
