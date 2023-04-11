const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Events, ComponentType } = require('discord.js');
const Semester = require('../utils/Semester.js');
const Course = require('../utils/Course.js');
const { confirmButton } = require('../utils/confirmButton.js');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('endsemester')
		.setDescription('Archives all categories and channels for a given semester.')
		.addStringOption(option =>
			option.setName('semester')
			.setDescription('Name of semester whose course channels will be deleted.')),

	async execute(interaction, client) {
		const semesterName = interaction.options.getString('semester');

		if (!await confirmButton(interaction, "Are you sure you want to archive this semester?", "Archiving Semester!")) {
			return;
		}

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

			const category = await interaction.guild.channels.fetch(semesterObject.courseList[courseIndex].categoryId);

			for (roleIndex in semesterObject.courseList[courseIndex].studentRoleId) {

				await category.permissionOverwrites.delete(semesterObject.courseList[courseIndex].studentRoleId[roleIndex]); // Remove viewing permissions from student role.
				for (channel of category.children.cache) {
					await channel[1].permissionOverwrites.delete(semesterObject.courseList[courseIndex].studentRoleId[roleIndex]); // Remove viewing permissions from student role.
				}
				
				const studentRole = await interaction.guild.roles.fetch(semesterObject.courseList[courseIndex].studentRoleId[roleIndex]);
				const studentArray = studentRole.members;
				for (student of studentArray.values()) {
					await student.roles.add(semesterObject.courseList[courseIndex].veteranRoleId[roleIndex]);
					await student.roles.remove(semesterObject.courseList[courseIndex].studentRoleId[roleIndex]);
				}

			}

		}

		await interaction.followUp({
			content: "Semester archived!",
			ephemeral: true
		});
		return;


	},
};
