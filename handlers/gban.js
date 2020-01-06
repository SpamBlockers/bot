const escapeHtml = require(`@youtwitface/escape-html`);
const parseText = require(`../middleware/parseText`);
const mention = require(`../middleware/mention`);
const getUserMention = require(`../middleware/getUserMention`);
const createLogMessage = require(`../middleware/createLogMessage`);

const { LOG_CHANNEL } = process.env;

module.exports = (bot, db) => {
    bot.command(`gban`, parseText, ctx => {
        if (!db.admins.includes(ctx.from.id)) return;

        const { id, reason } = ctx.text;

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
                    message: `I can't ban an admin`,
                })
            );
        } else if (id === ctx.botInfo.id) {
            return ctx.reply(
                createLogMessage({
                    header: `Error`,
                    message: `Why would I ban myself?`,
                })
            );
        }

        const insertedUser = {
            user_id: id,
            banned_by: ctx.from.id,
            reason,
        };

        db.users.findOne({ user_id: id }, (err, user) => {
            if (err) {
                console.log(err);
                return ctx.repy(
                    createLogMessage({
                        header: `Error`,
                        message: err.message,
                    })
                );
            } else if (user) {
                if (reason === user.reason) {
                    return ctx.reply(
                        createLogMessage({
                            header: `Error`,
                            message: `That user is already banned with the same reason`,
                        })
                    );
                }

                return db.users.update(
                    { user_id: id },
                    { $set: insertedUser },
                    {},
                    async err => {
                        if (err) {
                            console.log(err);
                            return ctx.repy(
                                createLogMessage({
                                    header: `Error`,
                                    message: err.message,
                                })
                            );
                        }

                        const message = createLogMessage({
                            header: `Reason Update`,
                            admin: mention(ctx.from, true),
                            user: await getUserMention(bot, id, true),
                            oldReason: user.reason
                                ? escapeHtml(user.reason)
                                : `<i>No reason specified</i>`,
                            newReason: reason
                                ? escapeHtml(reason)
                                : `<i>No reason specified</i>`,
                        });

                        ctx.reply(message);

                        if (LOG_CHANNEL != ctx.chat.id) {
                            bot.telegram.sendMessage(LOG_CHANNEL, message, {
                                parse_mode: `html`,
                            });
                        }
                    }
                );
            }

            db.users.insert(insertedUser, err => {
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
                            .kickChatMember(chat.chat_id, id)
                            .catch(() => {});
                    });

                    const message = createLogMessage({
                        header: `Ban`,
                        admin: mention(ctx.from, true),
                        user: await getUserMention(bot, id, true),
                        reason: reason
                            ? escapeHtml(reason)
                            : `<i>No reason specified</i>`,
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
