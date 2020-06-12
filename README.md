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
5. Optionally, [set up also](https://docs.spamblockers.bot/api-docs/setup) the API server. 

### Development in Gitpod

[Click here to start a new dev env in Gitpod](https://gitpod.io/#github.com/YouTwitFace/SpamBlockerBot). After spinning up an new workspace,
feel free to hack around the code.

## Commands Reference

| Command | Category | Permissions | Description |
| ----- | ----- | ----- | ----
| `/clean` | _Database Management_ | _Admins_ | Cleans up the clutter collected from database. |
| `/gban <userid/reply> <reason>` | _Blacklists_  | _Admins_ | Globally bans a user with a valid reason. |
| `/ungban <userid/reply> <reason>`| _Blacklists_ | _Admins_ | Globally unbans a user. |
| `/stats` | _Database Stats_ | _Admins_ | Pull global stats from bot database. |
| `/generate_token` | _API Access_ | _Everyone_ | Generates a new token. Only one token can be generated and active at a time. |
| `/revoke_token` | _API Access_ | _Everyone_
| `/help` or `/docs` | _Documentation_ | _Everyone_ | Read some help and some support links on using the bot. |
| `/stat <userid/reply>` | _Blacklists / Database Stats_ | _Everyone_ | Pull stats for a user from bot database. |
| `/start` | _Uptime Status_ | _Everyone_ | Checks if the bot is dead. |

## Documentation

<https://docs.spamblockers.bot> (soon)
