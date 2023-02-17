const { SlashCommandBuilder } = require('discord.js');
const Semester = require('../utils/Semester.js');
const Course = require('../utils/Course.js');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('deletesemester')
		.setDescription('Deletes all categories and channels for a given semester.')
		.addStringOption(option =>
			option.setName('semester')
			.setDescription('Name of semester whose course channels will be deleted.')),

	async execute(interaction, client) {
		const semesterName = interaction.options.getString('semester');

		await interaction.reply({
			content: 'Deleting ' + semesterName + '!',
			ephemeral: true
		});

		// Read semester object from file
		var semesterObject;
		if (fs.existsSync("data/semesters/" + semesterName + ".json")) {
			data = fs.readFileSync("data/semesters/" + semesterName + ".json", "utf-8");
			semesterObject = Object.assign(new Semester(), JSON.parse(data));
		} else {

			await interaction.followUp({
				content: "Semester given was not found.",
				ephemeral: true
			});
			return;
		}

		// Runs this loop once for each course in the semester's courseList
		for (courseIndex in semesterObject.courseList) {

			// TODO: Catch error if channel is already deleted.
			category = await interaction.guild.channels.fetch(semesterObject.courseList[courseIndex].categoryId);

			for (channel of category.children.cache) {
				channel[1].delete("This channel was automatically deleted by the bot due to the use of the /deletesemester command.");
			}
			category.delete("This category was automatically deleted by the bot due to the use of the /deletesemester command.");
			// Set category id to undefined.
			semesterObject.courseList[courseIndex].categoryId = void 0;
		}

		// Update semester file
		semesterObject.updateFile();

		await interaction.followUp({
			content: "Semester deleted successfully!",
			ephemeral: true
		});

	},
};
