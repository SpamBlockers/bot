const escapeHtml = require(`@youtwitface/escape-html`);
const parseText = require(`../middleware/parseText`);
const mention = require(`../middleware/mention`);

const { LOG_CHANNEL } = process.env;

module.exports = (bot, db) => {
    bot.command([`gban`, `fban`], parseText, ctx => {
        if (!db.admins.includes(ctx.from.id)) return;

        const { id, reason } = ctx.text;

        if (!id) {
            return ctx.reply(`That id doesn't seem valid.`);
        } else if (db.admins.includes(id)) {
            return ctx.reply(`I can't ban an admin.`);
        }

        db.users.findOne({ user_id: id }, (err, user) => {
            if (err) {
                console.log(err);
                return ctx.repy(`There was an error.`);
            } else if (user) {
                return ctx.reply(`That user is already banned.`);
            }

            const insertedUser = {
                user_id: id,
                banned_by: ctx.from.id,
                reason,
                banned_at: new Date(),
            };

            db.users.insert(insertedUser, err => {
                if (err) {
                    console.log(err);
                    return ctx.reply(`There was an error.`);
                }

                db.chats.find({}, async (err, chats) => {
                    if (err) {
                        console.log(err);
                        return ctx.reply(`There was an error.`);
                    }

                    chats.forEach(chat => {
                        bot.telegram
                            .kickChatMember(chat.chat_id, id)
                            .catch(() => {});
                    });

                    ctx.reply(`User has been banned.`);

                    const tgUser = await bot.telegram.getChat(id);
                    const adminMention = mention(ctx.from, true);
                    const userMention = mention(tgUser, true);
                    let logMessage = `<b>Type:</b> Ban\n<b>Admin:</b> ${adminMention}\n<b>User:</b> ${userMention}`;

                    if (reason) {
                        logMessage += `\n<b>Reason:</b> ${escapeHtml(reason)}`;
                    }

                    bot.telegram.sendMessage(LOG_CHANNEL, logMessage, {
                        parse_mode: `html`,
                    });
                });
            });
        });
    });
};
