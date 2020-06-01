require(`dotenv`).config();

const mongoose = require(`mongoose`);
const Telegraf = require(`telegraf`);
const bot = new Telegraf(process.env.BOT_TOKEN);

(async () => {
    await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    });

    // Check for DB connection and exits if not successfully connected.
    var db = mongoose.connection;
    if (!db) {
        console.log(`Successfully connected to MongoDB`);
    } else {
        console.error(`Check your MONGO_URI environment variable if still working.`);
        console.error(`Also check your DB login info if still working`);
        process.exit(1);
    }

    bot.context.reply = function (text, extra = {}) {
        this.assert(this.chat, `reply`);

        return this.telegram.sendMessage(this.chat.id, text, {
            parse_mode: `html`,
            ...extra,
        });
    };

    require(`./handlers`)(bot);
    
    require(`./server`);

    bot.launch().then(() => {
        console.log(`@${bot.context.botInfo.username} is running...`);
    });
})();
