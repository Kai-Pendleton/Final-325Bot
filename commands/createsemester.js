const { SlashCommandBuilder } = require('discord.js');
const Semester = require('../utils/Semester.js');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('createsemester')
		.setDescription('creates a semester')
		.addStringOption(option =>
			option.setName('name')
			.setDescription('Name of new semester. Ex. Winter 2023')),
	async execute(interaction, client) {

		await interaction.reply({
			content: 'Creating semester!',
			ephemeral: true
		});

		const name = interaction.options.getString('name');

		sem1 = new Semester(name);

		if (!fs.existsSync("data/semesters/" + sem1.name + ".json")) {
			fs.writeFileSync("data/semesters/" + sem1.name + ".json", JSON.stringify(sem1, null, 2),"utf-8");
		} else {
			await interaction.followUp({
				content: "Semester already exists!",
				ephemeral: true
			});
			return;
		}

		await interaction.followUp({
			content: "Semester created!",
			ephemeral: true
		});
	},
};
