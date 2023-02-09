const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('addclass')
		.setDescription('adds class to an existing semester'),
	async execute(interaction) {
		await interaction.reply({
			content: 'Pong!',
			ephemeral: true
		});
	},
};
