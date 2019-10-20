const parseText = require(`../middleware/parseText`);
const mention = require(`../middleware/mention`);
const createLogMessage = require(`../middleware/createLogMessage`);

const { LOG_CHANNEL } = process.env;

module.exports = (bot, db) => {
    bot.command(`ungban`, parseText, ctx => {
        if (!db.admins.includes(ctx.from.id)) return;

        const { id } = ctx.text;

        if (!id) {
            return ctx.reply(
                createLogMessage({
                    header: `Error`,
                    message: `That id doesn't seem valid`,
                }),
                { parse_mode: `html` }
            );
        } else if (db.admins.includes(id)) {
            return ctx.reply(
                createLogMessage({
                    header: `Error`,
                    message: `Why would an admin be banned? 🤔`,
                }),
                { parse_mode: `html` }
            );
        }

        db.users.findOne({ user_id: id }, (err, user) => {
            if (err) {
                console.log(err);
                return ctx.repy(
                    createLogMessage({
                        header: `Error`,
                        message: err.message,
                    }),
                    { parse_mode: `html` }
                );
            } else if (!user) {
                return ctx.reply(
                    createLogMessage({
                        header: `Error`,
                        message: `That user isn't banned`,
                    }),
                    { parse_mode: `html` }
                );
            }

            db.users.remove({ user_id: id }, err => {
                if (err) {
                    console.log(err);
                    return ctx.reply(
                        createLogMessage({
                            header: `Error`,
                            message: err.message,
                        }),
                        { parse_mode: `html` }
                    );
                }

                db.chats.find({}, async (err, chats) => {
                    if (err) {
                        console.log(err);
                        return ctx.reply(
                            createLogMessage({
                                header: `Error`,
                                message: err.message,
                            }),
                            { parse_mode: `html` }
                        );
                    }

                    chats.forEach(chat => {
                        bot.telegram
                            .unbanChatMember(chat.chat_id, id)
                            .catch(() => {});
                    });

                    let tgUser;
                    try {
                        tgUser = await bot.telegram.getChat(id);
                    } catch (_) {
                        tgUser = null;
                    }

                    const message = createLogMessage({
                        header: `Unban`,
                        admin: mention(ctx.from, true),
                        user: tgUser
                            ? mention(tgUser, true)
                            : `Unknown User (<code>${id}</code>)`,
                    });

                    ctx.reply(message, {
                        parse_mode: `html`,
                    });

                    if (LOG_CHANNEL != ctx.chat.id) {
                        bot.telegram.sendMessage(LOG_CHANNEL, message, {
                            parse_mode: `html`,
                        });
                    }
                });
            });
        });
    });
};
