const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('addcourse')
		.setDescription('adds course to an existing semester'),
	async execute(interaction) {
		await interaction.reply({
			content: 'Pong!',
			ephemeral: true
		});
	},
};
