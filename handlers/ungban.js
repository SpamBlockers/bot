const Chat = require(`../models/chat`);
const User = require(`../models/user`);
const admins = require(`../admins.json`);
const asyncHandler = require(`../middleware/asyncHandler`);
const createLogMessage = require(`../middleware/createLogMessage`);
const getUserMention = require(`../middleware/getUserMention`);
const mention = require(`../middleware/mention`);
const parseText = require(`../middleware/parseText`);

const { LOG_CHANNEL } = process.env;

module.exports = bot => {
    bot.command(`ungban`, parseText, asyncHandler(async ctx => {
        if (!admins.includes(ctx.from.id)) return;

        const { id } = ctx.text;

        if (!id) {
            throw new Error(`That id doesn't seem valid`);
        } else if (admins.includes(id)) {
            throw new Error(`Why would an admin be banned? 🤔`);
        }

        const user = await User.findOne({ user_id: id });

        if (!user) {
            throw new Error(`That user isn't banned`);
        }

        await User.deleteOne({ user_id: id });
        const chats = await Chat.find();

        chats.forEach(chat => {
            bot.telegram
                .unbanChatMember(chat.chat_id, id)
                .catch(() => { });
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
    }));
};
