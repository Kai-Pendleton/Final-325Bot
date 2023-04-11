const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Displays a list of available commands and their functions.'),
    async execute(interaction) {
        const commandsList = [
            { name: '/settemplate', description: 'This command will set the templates for all the courses.' },
            { name: '/createsemester', description: 'This will create a new semester.' },
            { name: '/addcourse', description: 'This command allows you to add a course to an existing semester with optional channels.' },
            { name: '/addcohabited', description: 'This command will allow you to add cohabited courses to existing course within a semester.'},
            { name: '/launchsemester', description: 'This command will initialize all the categories, channels, and permissions for a given semester.' },
            { name: '/endsemester', description: 'Archives all categories and channels for a given semester. Takes everyone with a student role and changes a to veteran role.' },
            { name: '/deletesemester', description: 'This command will completely delete all channels and categories related to a given semester.' },
            { name: '/create-role', description: 'Using this command will take a current role and copy it with its permissions new student and veteran role, assigning it a unique color from color.json.' },
            { name: '/reactionroles', description: 'Creates a message students can react to that will give them a specific role.' },
            { name: '/infosemester', description: 'Reads all .json categories under /data/semester and prints out current semester list.' },
            { name: '/help', description: 'Will list all current commands and give information on how to use them.' },
            { name: '/duplicate', description: 'It takes a category and makes a new category with a new name given by the user and copy all channels and messages within channel into new channel.' },
            { name: '/ping', description: 'This command will send a simple message reply of "Pong!".' },
        ];

        const commandsInfo = commandsList.map(command => `**${command.name}**: ${command.description}`).join('\n');

        const botInstructions = `
        Bot Instructions:
        1) Use /settemplate to set the template categories and student role for the bot. The "template" option refers to the category that contains channels that every course will have. The "optional-template" option refers to the category that contains every optional channel that a course might have. The "template-student-role" refers to a template role that is used to set the permissions of each channel. Give the template student role the permissions that a regular student should have for each template channel.
        2) Use /createsemester to build a shell of a semester where you can add/remove multiple courses.
        3) Use the /addcourse to add a course to a semester shell. Here you have the option for Name, Location/Zoom URL, Meet-time, and Semester.
        4) #Optional /deletecourse removes a course from a semester. The two options are Course name and Semester name. This will not delete channels if the semester has been launched!
        5) Use /launchsemester to launch the semester. All channels and class roles will be created with appropriate permissions.
        6) #Optional use /deletesemester to delete all of the course channels from all of the courses in a semester.
        7) Use /endsemester to archive all class channels, making them unviewable by students and converting students to veterans.
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
