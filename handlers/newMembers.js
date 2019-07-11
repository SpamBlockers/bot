const mention = require('../middleware/mention');

module.exports = (bot, db) => {
    bot.on(`new_chat_members`, ctx => {
        const { chat, new_chat_members: members } = ctx.message;

        members.forEach(async member => {
            if (member.id === ctx.botInfo.id) {
                return db.chats.insert({ chat_id: chat.id }, err => {
                    if (err) console.log(err);
                });
            }

            db.users.findOne({ user_id: member.id }, (err, user) => {
                if (err) return console.log(err);
                ctx.kickChatMember(member.id).catch(() => {});

                let message = `${mention(member)} is globally banned.`;

                if (user.reason) {
                    message += `\nReason: ${escapeHtml(user.reason)}`;
                }

                ctx.reply(message, {
                    parse_mode: `html`,
                });
            });
        });
    });
};
