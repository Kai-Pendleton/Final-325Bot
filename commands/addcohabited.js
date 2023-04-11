const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Events, ComponentType } = require('discord.js');
const Semester = require('../utils/Semester.js');
const Course = require('../utils/Course.js');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('addcohabited')
		.setDescription('adds another course onto an existing course!')
		.addStringOption(option =>
			option.setName('name')
			.setDescription('Name of new course (Ex. CSC325)'))
		.addStringOption(option =>
			option.setName('originalcourse')
			.setDescription('Name of course to be cohabited with. This must already exist.'))
		.addStringOption(option =>
			option.setName('semester')
			.setDescription('Semester of new course (Must have been made with /addSemester)')),
	async execute(interaction, client) {
		const newCourseName = interaction.options.getString('name');
		const existingCourseName = interaction.options.getString('originalcourse');
		const semesterName = interaction.options.getString('semester');

		await interaction.reply({
			content: 'Adding course...',
			ephemeral: true
		});

		let sem1;

		// Retrieve Semester from file
		if (fs.existsSync("data/semesters/" + semesterName + ".json")) {
			let data = fs.readFileSync("data/semesters/" + semesterName + ".json", "utf-8");
			sem1 = Object.assign(new Semester(), JSON.parse(data));
		} else {

			await interaction.followUp({
				content: "Semester given was not found.",
				ephemeral: true
			});
			return;
		}

		// Check if original course exists.
		let isExists = false;
		for (course of sem1.courseList) {
			console.log(course.name);
			if (course.name.includes(existingCourseName)) {
				isExists = true;
			}
		}
		if (!isExists) {
			await interaction.followUp({
				content: "Original course was not found. /addcohabited must be given an existing course to be added upon.",
				ephemeral: true
			});
			return;
		}

		let courseIndex = sem1.courseList.findIndex(course => course.name.includes(existingCourseName));

		sem1.courseList[courseIndex].name.push(newCourseName);
		sem1.updateFile();

		let msgContent = existingCourseName + " was added as a cohabited course to " + existingCourseName + "!";
		await interaction.editReply({
			content: msgContent,
			ephemeral: true
		});
		
	},
};