# Simple Role bot

## Commands

`!help`

<img src="https://i.imgur.com/9UkpIMJ.png" width="500">

`!configure`

<img src="https://i.imgur.com/4aAIrtA.png" width="500">



`!addRole "rolename" <:roleEmote:>`
 
<img src="https://i.imgur.com/vJ4ee2j.png" width="500">

## Updating role emotes
------
If you want to update a role emote, just add the role, like shown above with the new emote. The new emote will override the old emote. 
E.g. There is an existing role named "Minecraft" with the emote.

Type `!addRole "Minecraft" :newEmote:`

Alternatively you can use the command `!updateRole "Minecraft" :newEmote:`


# Install

To host this bot you need to create two additional files in the root directory.

## 1) .env

Needs to contain two attributes
 - ### `TOKEN=THISISMYDISCORDBOTTOKEN`
 - ### `PREFIX=!`

## 2) authorizedUsers.json
A json string list containing all user id's, the bot will listen to.
```json
[
    "123456790123456",
    "987654332198765"
]
```

After adding those files, you can start the bot locally by using `node`

`node src/index.js`