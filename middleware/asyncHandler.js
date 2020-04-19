const createLogMessage = require(`./createLogMessage`);

module.exports = handler =>
    (ctx, next) => {
        handler(ctx, next).catch(error => {
            console.error(error);

            const message = createLogMessage({
                header: `Error`,
                message: error.message,
            });

            ctx.reply(message);
        });
    };
