const handlers = [`start`, `gban`, `ungban`, `newMembers`, `stats`, `clean`];

module.exports = bot =>
    handlers.forEach(handler => require(`./${handler}`)(bot));
