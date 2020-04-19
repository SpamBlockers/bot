require(`dotenv`).config();

const mongoose = require(`mongoose`);
const Telegraf = require(`telegraf`);
const bot = new Telegraf(process.env.BOT_TOKEN);

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
});

bot.context.reply = function(text, extra = {}) {
    this.assert(this.chat, `reply`);

    return this.telegram.sendMessage(this.chat.id, text, {
        parse_mode: `html`,
        ...extra,
    });
};

require(`./handlers`)(bot);

bot.launch().then(() => {
    console.log(`@${bot.context.botInfo.username} is running...`);
});
