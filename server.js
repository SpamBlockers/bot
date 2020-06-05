const express = require(`express`);
const app = express();
const mongoose = require(`mongoose`);
const bodyParser = require(`body-parser`);
const { version } = require(`./package.json`);

const serverInfo = {
    botVersion: version,
    apiServerVersion: `0.1.0`,

};

app.use(bodyParser.json);

app.get(`/`, (req, res) => {
    res.status(200).json({ ok: true, apiServerInfo: serverInfo });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Your API server is listening on port` + port);
});
