const parseText = require(`../middleware/parseText`);
const mention = require(`../middleware/mention`);

const { LOG_CHANNEL } = process.env;

module.exports = (bot, db) => {
    bot.command(`ungban`, parseText, ctx => {
        if (!db.admins.includes(ctx.from.id)) return;

        const { id } = ctx.text;

        if (!id) {
            return ctx.reply(`That id doesn't seem valid.`);
        } else if (db.admins.includes(id)) {
            return ctx.reply(`Why would an admin be banned? 🤔`);
        }

        db.users.findOne({ user_id: id }, (err, user) => {
            if (err) {
                console.log(err);
                return ctx.repy(`There was an error.`);
            } else if (!user) {
                return ctx.reply(`That user isn't banned.`);
            }

            db.users.remove({ user_id: id }, err => {
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
                            .unbanChatMember(chat.chat_id, id)
                            .catch(() => {});
                    });

                    ctx.reply(`User has been unbanned.`);

                    const tgUser = await bot.telegram.getChat(id);
                    const adminMention = mention(ctx.from, true);
                    const userMention = mention(tgUser, true);
                    const logMessage = `<b>Type:</b> Unban\n<b>Admin:</b> ${adminMention}\n<b>User:</b> ${userMention}`;

                    bot.telegram.sendMessage(LOG_CHANNEL, logMessage, {
                        parse_mode: `html`,
                    });
                });
            });
        });
    });
};
