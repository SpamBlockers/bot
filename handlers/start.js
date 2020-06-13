// Start message: Customize this if you have your own support chat.
const startMessage = `Hi, I'm a bot that was created to help stop spam. If you add me to your group with permission to ban, I will ban all users who are marked as spam by my admins.\n\nIf you want to help report spammers, you can report them in @SpamBlockers or PM one of the admins in the group.`;

module.exports = bot => {
    bot.command([`start`], ctx => {
        if (ctx.chat.type === `private`) {
            ctx.reply(startMessage);
        }
    });
};
