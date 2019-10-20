const escapeHtml = require(`@youtwitface/escape-html`);
const mention = require(`../middleware/mention`);
const createLogMessage = require(`../middleware/createLogMessage`);

module.exports = (bot, db) => {
    bot.on(`new_chat_members`, ctx => {
        const { chat, new_chat_members: members } = ctx.message;

        members.forEach(member => {
            if (member.id === ctx.botInfo.id) {
                return db.chats.insert({ chat_id: chat.id }, err => {
                    if (err) console.log(err);
                });
            }

            db.users.findOne({ user_id: member.id }, async (err, user) => {
                if (err) return console.log(err);
                else if (!user) return;

                ctx.kickChatMember(member.id).catch(() => {});

                let tgAdmin;
                try {
                    tgAdmin = await bot.telegram.getChat(user.banned_by);
                } catch (_) {
                    tgAdmin = null;
                }

                const message = createLogMessage({
                    header: `Ban`,
                    admin: tgAdmin
                        ? mention(tgAdmin)
                        : `Unknown User (<code>${user.banned_by}</code>)`,
                    user: mention(member),
                    reason: user.reason
                        ? escapeHtml(user.reason)
                        : `<i>No reason specified</i>`,
                });

                ctx.reply(message, {
                    parse_mode: `html`,
                });
            });
        });
    });
};
