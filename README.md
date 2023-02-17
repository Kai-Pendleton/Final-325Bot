# Private325Bot
Private version of our 325 bot. If you aren't a dev, get out!

## Current Commands

- /ping - Bot responds with ping. Good to see if bot is online.
- /duplicate - Duplicate selected text channel and give it a name you choose.

## Installation Instructions

To install the bot, clone the repository, create a .env file in the root of
the project. The .env file must have three lines, containing the bot's token,
the Discord server's ID, and the bot's profile ID. Ex:

Line 1: TOKEN=(Bot token)

Line 2: CLIENTID=(Bot profile ID)

Line 3: GUILDID=(Server ID)

Then, you can run the bot using "node ." in the root of the repository. Invite the bot to your server, and set the class template and optional channels template with /settemplate.
Now the bot is set up!

Here is a list of commands for the bot:
- /addcourse : This commands allows you to add a course to an existing semesters
- /create-role : Using this command you can create a new role with the given permissions
- /createsemester : This will create a new semester (edited)
- /deletesemester : This commands will delete all channels and categories related to a given - semester
- /duplicate : It takes a category and makes a new category with a new name given by the user and copy all channels and messages within channel into new channel
- /launchsemester : This command will initialize all the categories and channels for a given semester
- /ping : This command will send a simple message reply of "Pong!"
- /settemplate : This command will set the templates for all the courses
