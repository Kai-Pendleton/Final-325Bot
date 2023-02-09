const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('createsemester')
		.setDescription('creates a semester'),
	async execute(interaction) {
		await interaction.reply({
			content: 'Pong!',
			ephemeral: true
		});
	},
};
