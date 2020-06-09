// Links to the documentation.
const docsMessage = `Documentation\nThe documentation for SpamBlockers can be found in https://docs.spamblockers.bot`;

// Help and Support: Change this if you have your own support chat.
const helpAndSupportText = `Help and Support\n\nBot Support / Appeals / Spam Reports: @SpamBlockers\nCommands Reference: https://docs.spamblockers.bot/tg/commands-reference\nAPI Docs: https://docs.spamblockers.bot/api-docs`;

module.exports = bot => {
    bot.command([`docs`], ctx => {
        if (ctx.chat.type === `private`) {
            ctx.reply(docsMessage);
        }
    });

    bot.command([`help`, `support`], ctx => {
        if (ctx.chat.type === `private`) {
            ctx.reply(helpAndSupportText);
        }
    });
};
