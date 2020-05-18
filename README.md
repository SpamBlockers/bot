# SpamBlockers

## Requirements
* Node.js (v12.x or later is recommended) with `npm` (latest version recommended)
* MongoDB server
* Telegram Bot API token from BotFather
* Log chat (optional)

## Setup
1. Clone the Git repository to your machine then install dependencies.
2. Edit the `.env.sample` file and save it as `.env`.
3. Make a `admins.json` file with Telegram user IDs of admins you want to use admin-only commands.
```json
// It should be like this, but don't use these examples
// on your instance.
/* Notes:
 * 172811422 = @SitiSchu's user ID
 * 234480941 = @tWiTfAcE's user ID
 * 705519392 = @AJHalili2006's user ID
*/
[ 234480941, 172811422, 705519392]

// Not like this crap.
// And there's no "operator" key in admins.json
{
    "admins": [ 172811422, 705519392 ],
    "operator": 234480941
}
```
> :warning: **Make sure your user ID is included in `admins.json`!** While there's no
way to add yourself as a operator in the `admins.json`, its required to ad yourself to the list,
ensuring that you don't lose control to your gbanlist.
4. Finally, fire up the console and type `npm start` to hit the road.

## Commands Reference
| Command | Permissions | Description |
| ----- | ----- | ----- |
| `/start` | _Everyone_ | Checks if the bot is dead. |
| `/help` | _Everyone_ | This command doesn't exists. |
| `/gban <userid|username|reply> <reason>`  | _Admins_ | Globally bans a user with a valid reason. |
| `/ungban <userid|username|reply> <reason>`| _Admins_ | Globally unbans a user. |
| `/stats` | _Admins_ | Pull global stats from bot database. |
| `/clean` | _Admins_ | Cleans up the clutter collected from database.
| `/newMembers` | _Admins_ | Checks and pulls new members from database. |