# SpamBlockers

## Requirements

* Node.js (v12.x or later is recommended) with `npm` (latest version recommended)
* MongoDB server
* Telegram Bot API token from BotFather
* Log channel (optional)

## Setup

1. Clone the Git repository to your machine then install dependencies.
2. Edit the `.env.sample` file and save it as `.env`.
3. Make a `admins.json` file with an array of Telegram user IDs of admins you want to use admin-only commands.
4. Finally, fire up the console and type `npm start` to hit the road.

### Development in Gitpod

[Click here to start a new dev env in Gitpod](https://gitpod.io/#github.com/YouTwitFace/SpamBlockerBot)

[here (not recommended)]: https://gitpod.io/#github.com/AndreiJirohHaliliDev2006/SpamBlockersBot

## Commands Reference

| Command | Permissions | Description |
| ----- | ----- | ----- |
| `/clean` | _Admins_ | Cleans up the clutter collected from database. |
| `/gban <userid/reply> <reason>`  | _Admins_ | Globally bans a user with a valid reason. |
| `/ungban <userid/reply> <reason>`| _Admins_ | Globally unbans a user. |
| `/stats` | _Admins_ | Pull global stats from bot database. |
| `/stat <userid/reply>` | _Everyone_ | Pull stats for a user from bot database. |
| `/start` | _Everyone_ | Checks if the bot is dead. |

## Documentation

<https://docs.spamblockers.bot> (soon)
