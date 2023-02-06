const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('createrole')
		.setDescription('Lets you create a new role with a color '),
	async execute(interaction) {
		await interaction.reply('Getting array!');
		try {
			//const path = path.join('C:\Users\austi\Desktop\DiscordBot\New folder\Private325Bot\data\colors.json', '');
			console.log(__dirname);
			const data = fs.readFileSync('C:\\Users\\austi\\Desktop\\DiscordBot\\New folder\\Private325Bot\\data\\colors.json', 'utf8');
			const jsonDATA = JSON.parse(data);
			console.log(data);
			console.log(jsonDATA);
		} catch (err) {
			console.error(err);
		}
	},
};
