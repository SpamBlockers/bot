const parseText = require(`../middleware/parseText`);
const mention = require(`../middleware/mention`);
const getUserMention = require(`../middleware/getUserMention`);
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
                })
            );
        } else if (db.admins.includes(id)) {
            return ctx.reply(
                createLogMessage({
                    header: `Error`,
                    message: `Why would an admin be banned? 🤔`,
                })
            );
        }

        db.users.findOne({ user_id: id }, (err, user) => {
            if (err) {
                console.log(err);
                return ctx.repy(
                    createLogMessage({
                        header: `Error`,
                        message: err.message,
                    })
                );
            } else if (!user) {
                return ctx.reply(
                    createLogMessage({
                        header: `Error`,
                        message: `That user isn't banned`,
                    })
                );
            }

            db.users.remove({ user_id: id }, err => {
                if (err) {
                    console.log(err);
                    return ctx.reply(
                        createLogMessage({
                            header: `Error`,
                            message: err.message,
                        })
                    );
                }

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

                    chats.forEach(chat => {
                        bot.telegram
                            .unbanChatMember(chat.chat_id, id)
                            .catch(() => {});
                    });

                    const message = createLogMessage({
                        header: `Unban`,
                        admin: mention(ctx.from, true),
                        user: await getUserMention(bot, id, true),
                    });

                    ctx.reply(message);

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
