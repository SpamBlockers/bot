const path = require(`path`);
const NeDB = require(`nedb`);

const db = new NeDB({
    filename: path.join(__dirname, `../stores/users.db`),
    timestampData: true,
    autoload: true,
});

db.find({}, (err, users) => {
    if (err) return console.log(err);

    users.map(user => {
        if (user.banned_at) {
            user.createdAt = user.banned_at;
            user.updatedAt = user.banned_at;
            delete user.banned_at;

            db.update({ _id: user._id }, user);
        }
    });
});
