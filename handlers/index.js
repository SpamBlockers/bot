const handlers = [`start`, `gban`, `ungban`, `newMembers`, `stats`, `clean`];

module.exports = (bot, db) =>
    handlers.forEach(handler => require(`./${handler}`)(bot, db));
