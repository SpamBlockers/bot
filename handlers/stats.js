const Chat = require(`../models/chat`);
const User = require(`../models/user`);
const admins = require(`../admins.json`);
const escapeHtml = require(`@youtwitface/escape-html`);
const asyncHandler = require(`../middleware/asyncHandler`);
const createLogMessage = require(`../middleware/createLogMessage`);
const getUserMention = require(`../middleware/getUserMention`);
const parseText = require(`../middleware/parseText`);

const formatNumber = number =>
    number.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, `$1,`);

module.exports = bot => {
    bot.command(`stat`, parseText, asyncHandler(async ctx => {
        const { id } = ctx.text;

        if (!id) {
            throw new Error(`That id doesn't seem valid`);
        }

        const user = await User.findOne({ user_id: id });
        let message;

        if (user) {
            message = createLogMessage({
                header: `Ban`,
                admin: await getUserMention(bot, user.banned_by, true),
                user: await getUserMention(bot, id, true),
                reason: user.reason
                    ? escapeHtml(user.reason)
                    : `<i>No reason specified</i>`,
            });
        } else {
            message = createLogMessage({
                header: `Info`,
                message: `${id} is not banned`,
            });
        }

        ctx.reply(message);
    }));

    bot.command(`stats`, asyncHandler(async ctx => {
        if (!admins.includes(ctx.from.id)) return;

        const [chats, users] = await Promise.all([
            Chat.countDocuments(),
            User.countDocuments(),
        ]);

        const message = createLogMessage({
            header: `Stats`,
            chats: formatNumber(chats),
            users: formatNumber(users),
        });

        ctx.reply(message);
    }));
};
