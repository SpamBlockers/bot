const TEXT_REGEX = /^(?:(?:#id)?(\d+)+)?([\s\S]+)?$/;

module.exports = (ctx, next) => {
    const { reply_to_message: reply, text, entities } = ctx.message;

    const parsedText = text.slice(entities[0].length);
    let [, id, reason] = parsedText.trim().match(TEXT_REGEX) || [];

    if (!id && reply && reply.from) {
        id = reply.from.id;
    }

    ctx.text = {
        id: Number(id) || null,
        reason: reason ? reason.trim() : null
    };

    next(ctx);
};
