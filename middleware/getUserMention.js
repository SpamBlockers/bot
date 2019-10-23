const mention = require(`./mention`);

module.exports = async (bot, id, addId) => {
    let user;
    try {
        user = await bot.telegram.getChat(id);
    } catch (_) {
        user = null;
    }

    return user ? mention(user, addId) : `Unknown User (<code>${id}</code>)`;
};
