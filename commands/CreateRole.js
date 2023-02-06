const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('CreateRole')
		.setDescription('Lets you create a new role with a color '),
	async execute(interaction) {
		await interaction.reply('Pong!');
	},
};
