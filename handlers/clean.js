const { promisify } = require(`util`);
const createLogMessage = require(`../middleware/createLogMessage`);

module.exports = (bot, db) => {
    const removeChat = promisify(db.chats.remove.bind(db.chats));

    bot.command(`clean`, ctx => {
        if (!db.admins.includes(ctx.from.id)) return;

        db.chats.find({}, async (err, chats) => {
            if (err) {
                console.log(err);
                return ctx.reply(
                    createLogMessage({
                        header: `Error`,
                        message: err.message,
                    })
                );
            }

            let total = 0;
            let removed = 0;
            let failed = 0;

            for (const chat of chats) {
                total++;

                try {
                    await bot.telegram.getChat(chat.chat_id);
                } catch (error) {
                    if (error.description !== `Bad Request: chat not found`) {
                        failed++;
                    } else {
                        try {
                            await removeChat({ chat_id: chat.chat_id });
                            removed++;
                        } catch (error) {
                            failed++;
                        }
                    }
                }
            }

            const message = createLogMessage({
                header: `Chats Cleanup`,
                total,
                removed,
                failed,
            });

            ctx.reply(message);
        });
    });
};
