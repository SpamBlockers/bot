const parseText = require(`../middleware/parseText`);

module.exports = (bot, db) => {
    bot.command(`stat`, parseText, ctx => {
        const { id } = ctx.text;

        if (!id) {
            return ctx.reply(`That id doesn't seem valid.`);
        }

        db.users.findOne({ user_id: id }, (err, user) => {
            if (err) {
                console.log(err);
                return ctx.repy(`There was an error.`);
            } else if (!user) {
                return ctx.reply(`${id} is not banned.`);
            }

            let replyText = `${id} is banned.`;

            if (user.reason) {
                replyText += `\nReason: ${user.reason}`;
            }

            ctx.reply(replyText);
        });
    });

    bot.command(`stats`, async ctx => {
        if (!db.admins.includes(ctx.from.id)) return;

        db.chats.count({}, (err, chats) => {
            if (err) {
                console.log(err);
                return ctx.repy(`There was an error.`);
            }

            db.users.count({}, (err, users) => {
                if (err) {
                    console.log(err);
                    return ctx.repy(`There was an error.`);
                }

                ctx.reply(
                    `I am currently in ${chats} groups and have globally banned ${users} users.`
                );
            });
        });
    });
};
