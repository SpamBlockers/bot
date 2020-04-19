const Chat = require(`../models/chat`);
const User = require(`../models/user`);
const escapeHtml = require(`@youtwitface/escape-html`);
const createLogMessage = require(`../middleware/createLogMessage`);
const getUserMention = require(`../middleware/getUserMention`);
const mention = require(`../middleware/mention`);

module.exports = bot => {
    bot.on(`new_chat_members`, ctx => {
        const { chat, new_chat_members: members } = ctx.message;

        members.forEach(async member => {
            if (member.id === ctx.botInfo.id) {
                return await new Chat({ chat_id: chat.id }).save();
            }

            const user = await User.findOne({ user_id: member.id });

            if (user) {
                ctx.kickChatMember(member.id).catch(() => { });

                const message = createLogMessage({
                    header: `Ban`,
                    admin: await getUserMention(bot, user.banned_by),
                    user: mention(member),
                    reason: user.reason
                        ? escapeHtml(user.reason)
                        : `<i>No reason specified</i>`,
                });

                ctx.reply(message);
            }
        });
    });
};
