const admins = require(`../admins.json`);

const TEXT_REGEX = /^(?:(?:#id)?(\d+)+)?([\s\S]+)?$/;

module.exports = (ctx, next) => {
    const { reply_to_message: reply, text, entities } = ctx.message;

    const parsedText = text.slice(entities[0].length);
    let [, id, reason] = parsedText.trim().match(TEXT_REGEX) || [];
    let forwardId = id;

    if (!id && reply && reply.from) {
        id = reply.from.id;

        const { forward_from: forwardFrom } = reply;
        if (forwardFrom && admins.includes(id)) {
            forwardId = forwardFrom.id;
        }
    }

    id = Number(id) || null;
    ctx.text = {
        id,
        forwardId: forwardId || id,
        reason: reason ? reason.trim() : null,
    };

    next(ctx);
};
