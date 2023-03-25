const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Displays a list of available commands and their functions.'),
	async execute(interaction) {
		const commandsList = [
			{ name: '/settemplate',description: 'This command will set the templates for all the courses.' },
			{ name: '/createsemester', description: 'This will create a new semester.' },
			{ name: '/addcourse', description: 'This commands allows you to add a course to an existing semesters.' },
			{ name: '/launchsemester', description: 'This command will initialize all the categories and channels for a given semester.' },
			{ name: '/deletesemester', description: 'This commands will delete all channels and categories related to a given semester.' },
			{ name: '/create-role', description: 'Using this command will take a current role and copy it with its permissions new student and veteran role, assigning it a color from color.json file which will only use each color once.' },
			{ name: '/reactionroles', description: 'Creates a message students can react to that will give them a specific role.' },
			{ name: '/endsemester', description: 'Archives all categories and channels for a given semester. Takes everyone with a student role and changes a to veteran role.' },
			{ name: '/infosemester', description: 'Reads all .ison categories under /data/semester and prints out current semester list.' },
			{ name: '/help', description: 'Will list all current commands and give information on how to use them.' },
			{ name: '/duplicate', description: 'It takes a category and makes a new category with a new name given by the user and copy all channels and messages within channel into new channel.' },
			{ name: '/ping', description: 'This command will send a simple message reply of "Pong!".' },
		];

		const commandsInfo = commandsList.map(command => `**${command.name}**: ${command.description}`).join('\n');

		await interaction.reply({
			content: `Here's a list of available commands:\n\n${commandsInfo}`,
			ephemeral: false,
		});
	},
};
