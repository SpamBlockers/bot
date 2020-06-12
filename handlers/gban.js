const Chat = require(`../models/chat`);
const User = require(`../models/user`);
const admins = require(`../admins.json`);
const escapeHtml = require(`@youtwitface/escape-html`);
const asyncHandler = require(`../middleware/asyncHandler`);
const createLogMessage = require(`../middleware/createLogMessage`);
const getUserMention = require(`../middleware/getUserMention`);
const mention = require(`../middleware/mention`);
const parseText = require(`../middleware/parseText`);

const { LOG_CHANNEL } = process.env;

module.exports = bot => {
    bot.command(`gban`, parseText, asyncHandler(async ctx => {
        if (!admins.includes(ctx.from.id)) return;

        const { forwardId: id, reason } = ctx.text;

        if (!id) {
            throw new Error(`That id doesn't seem valid`);
        } else if (admins.includes(id)) {
            throw new Error(`I can't ban an admin`);
        } else if (id === 777000) {
            throw new Error(`Why you want to ban Telegram?`);
        } else if (id === ctx.botInfo.id) {
            throw new Error(`Why would I ban myself?`);
        }

        const newUser = {
            user_id: id,
            banned_by: ctx.from.id,
            reason,
        };

        const user = await User.findOne({ user_id: id });

        if (user) {
            if (reason === user.reason) {
                return ctx.reply(
                    createLogMessage({
                        header: `Error`,
                        message: `That user is already banned with the same reason`,
                    })
                );
            }

            await User.update({ user_id: id }, { $set: newUser });

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

            return;
        }

        await new User(newUser).save();
        const chats = await Chat.find();

        chats.forEach(chat =>
            bot.telegram
                .kickChatMember(chat.chat_id, id)
                .catch(() => { })
        );

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
    }));
};
