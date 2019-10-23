const escapeHtml = require(`@youtwitface/escape-html`);
const parseText = require(`../middleware/parseText`);
const getUserMention = require(`../middleware/getUserMention`);
const createLogMessage = require(`../middleware/createLogMessage`);

const formatNumber = number =>
    number.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, `$1,`);

module.exports = (bot, db) => {
    bot.command(`stat`, parseText, ctx => {
        const { id } = ctx.text;

        if (!id) {
            return ctx.reply(
                createLogMessage({
                    header: `Error`,
                    message: `That id doesn't seem valid`,
                })
            );
        }

        db.users.findOne({ user_id: id }, async (err, user) => {
            if (err) {
                console.log(err);
                return ctx.repy(
                    createLogMessage({
                        header: `Error`,
                        message: err.message,
                    })
                );
            } else if (!user) {
                return ctx.reply(
                    createLogMessage({
                        header: `Info`,
                        message: `${id} is not banned`,
                    })
                );
            }

            const message = createLogMessage({
                header: `Ban`,
                admin: await getUserMention(bot, user.banned_by, true),
                user: await getUserMention(bot, id, true),
                reason: user.reason
                    ? escapeHtml(user.reason)
                    : `<i>No reason specified</i>`,
            });

            ctx.reply(message);
        });
    });

    bot.command(`stats`, async ctx => {
        if (!db.admins.includes(ctx.from.id)) return;

        db.chats.count({}, (err, chats) => {
            if (err) {
                console.log(err);
                return ctx.repy(
                    createLogMessage({
                        header: `Error`,
                        message: err.message,
                    })
                );
            }

            db.users.count({}, (err, users) => {
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
                    header: `Stats`,
                    chats: formatNumber(chats),
                    users: formatNumber(users),
                });

                ctx.reply(message);
            });
        });
    });
};
