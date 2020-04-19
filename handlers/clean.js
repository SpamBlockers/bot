const Chat = require(`../models/chat`);
const admins = require(`../admins.json`);
const asyncHandler = require(`../middleware/asyncHandler`);
const createLogMessage = require(`../middleware/createLogMessage`);

module.exports = bot => {
    bot.command(`clean`, asyncHandler(async ctx => {
        if (!admins.includes(ctx.from.id)) return;

        const chats = await Chat.find({});

        let removed = 0;
        let failed = 0;

        for (const chat of chats) {
            try {
                await bot.telegram.getChat(chat.chat_id);
            } catch (error) {
                if (error.description !== `Bad Request: chat not found`) {
                    failed++;
                } else {
                    await Chat.deleteOne({ chat_id: chat.chat_id });
                    removed++;
                }
            }
        }

        const message = createLogMessage({
            header: `Chats Cleanup`,
            total: chats.length,
            removed,
            failed,
        });

        ctx.reply(message);
    }));
};
