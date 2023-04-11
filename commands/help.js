const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Displays a list of available commands and their functions.'),
    async execute(interaction) {
        const commandsList = [
            { name: '/settemplate', description: 'This command will set the templates for all the courses.' },
            { name: '/createsemester', description: 'This will create a new semester.' },
            { name: '/addcourse', description: 'This commands allows you to add a course to an existing semesters.' },
            { name: '/launchsemester', description: 'This command will initialize all the categories and channels for a given semester.' },
            { name: '/deletesemester', description: 'This commands will delete all channels and categories related to a given semester.' },
            { name: '/create-role', description: 'Using this command will take a current role and copy it with its permissions new student and veteran role, assigning it a color from color.json file which will only use each color once.' },
            { name: '/reactionroles', description: 'Creates a message students can react to that will give them a specific role.' },
            { name: '/endsemester', description: 'Archives all categories and channels for a given semester. Takes everyone with a student role and changes a to veteran role.' },
            { name: '/infosemester', description: 'Reads all .json categories under /data/semester and prints out current semester list.' },
            { name: '/help', description: 'Will list all current commands and give information on how to use them.' },
            { name: '/duplicate', description: 'It takes a category and makes a new category with a new name given by the user and copy all channels and messages within channel into new channel.' },
            { name: '/ping', description: 'This command will send a simple message reply of "Pong!".' },
        ];

        const commandsInfo = commandsList.map(command => `**${command.name}**: ${command.description}`).join('\n');

        const botInstructions = `
        Bot Instructions:
        1) Use /settemplate to build the framework for a semester. This command will prompt for a template. Select [template class]. Next, the prompt is optional templates select [optional channels template].
        2) Use /createsemester to build a shell of a semester where you can add/remove multiple courses. Within the text box title the semester.
        3) Use the /addcourse to add a course to a semester shell. Here you have the option for Name, Location, Meet-time, and Semester.
        4) #Optional /deletecourse removes a course from a semester. The two options are Course name and Semester name.
        5) Use /launchsemester to engage or launch the semester with the only option being the semester name.
        6) #Optional use /deletesemester to delete a semester.
        NOTE: the template student role CANNOT have permission overwrites on general channel permissions.
    `;

        // Split the message into two parts to fit in a single Discord message
        const firstMessage = botInstructions;
        const secondMessage = 'Here\'s a list of available commands:\n' + commandsInfo;

        // Send two separate messages
        await interaction.reply({
            content: firstMessage,
            ephemeral: false,
        });
        await interaction.followUp({
            content: secondMessage,
            ephemeral: false,
        });
    },

};
