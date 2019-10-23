require(`dotenv`).config();

const path = require(`path`);
const NeDB = require(`nedb`);
const Telegraf = require(`telegraf`);
const bot = new Telegraf(process.env.BOT_TOKEN);

const db = {
    chats: new NeDB({
        filename: path.join(__dirname, `stores/chats.db`),
        autoload: true,
        onload: err => {
            if (err) throw err;

            db.chats.ensureIndex(
                { fieldName: `chat_id`, unique: true },
                err => {
                    if (err) throw err;
                }
            );
        },
    }),
    users: new NeDB({
        filename: path.join(__dirname, `stores/users.db`),
        timestampData: true,
        autoload: true,
        onload: err => {
            if (err) throw err;

            db.users.ensureIndex(
                { fieldName: `user_id`, unique: true },
                err => {
                    if (err) throw err;
                }
            );
        },
    }),
    admins: require(`./admins.json`).map(admin => Number(admin)),
};

bot.context.reply = function(text, extra = {}) {
    this.assert(this.chat, `reply`);

    return this.telegram.sendMessage(this.chat.id, text, {
        parse_mode: `html`,
        ...extra,
    });
};

require(`./handlers`)(bot, db);

bot.launch().then(() => {
    console.log(`@${bot.context.botInfo.username} is running...`);
});
