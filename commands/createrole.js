const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('createrole')
		.setDescription('Lets you create a new role with a color '),
	async execute(interaction, client) {
		await interaction.reply({
			content: 'Getting array!',
			ephemeral: true
		});
		try {
			const colorsPath = path.join(__dirname, '..', 'data', "colors.json");
			const data = JSON.parse(fs.readFileSync(colorsPath, 'utf8'));
			console.log(data);
		} catch (err) {
			console.error(err);
		}
	},
};
