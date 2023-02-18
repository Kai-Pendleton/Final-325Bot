# Private325Bot
Private version of our 325 bot. If you aren't a dev, get out!

## Current Commands

- /settemplate: This command will set the templates for all the courses
- /createsemester: This will create a new semester 
- /addcourse: This commands allows you to add a course to an existing semesters 
- /launchsemester: This command will initialize all the categories and channels for a given semester 
- /deletesemester: This commands will delete all channels and categories related to a given semester
- /ping: This command will send a simple message reply of "Pong!"
- /duplicate: It takes a category and makes a new category with a new name given by the user and copy all channels and messages within channel into new channel 
- /create-role: Using this command will take a current role with the student permissions and copy it with a new role name

## Installation Instructions

To install the bot, clone the repository, create a .env file in the root of
the project. The .env file must have three lines, containing the bot's token,
the Discord server's ID, and the bot's profile ID. Ex:

Line 1: TOKEN=(Bot token)

Line 2: CLIENTID=(Bot profile ID)

Line 3: GUILDID=(Server ID)

Invite the bot to your server, deploy the slash commands by running "node deploy-commands.js", then run the bot using "node ." and set the class template and optional channels template with /settemplate.
Now the bot is set up!
