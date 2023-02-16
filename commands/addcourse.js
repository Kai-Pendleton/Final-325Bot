const { SlashCommandBuilder } = require('discord.js');
const Semester = require('../utils/Semester.js');
const Course = require('../utils/Course.js');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('addcourse')
		.setDescription('adds course to an existing semester')
		.addStringOption(option =>
			option.setName('name')
			.setDescription('Name of new course (Ex. CSC325)'))
		.addStringOption(option =>
			option.setName('location')
			.setDescription('Location of new course (Ex. MSB163 or https://umich.zoom.us/j/1234567890)'))
		.addStringOption(option =>
			option.setName('meet-time')
			.setDescription('Meeting time of new course (Ex. 12:30-1:45 or asynchronous)'))
		.addStringOption(option =>
			option.setName('semester')
			.setDescription('Semester of new course (Must have been made with /addSemester)')),
	async execute(interaction, client) {
		const name = interaction.options.getString('name');
		const meetingLoc = interaction.options.getString('location');
		const meetingTime = interaction.options.getString('meet-time');
		const semesterName = interaction.options.getString('semester');

		await interaction.reply({
			content: 'Creating course...',
			ephemeral: true
		});

		var sem1;

		// Retrieve Semester from file
		if (fs.existsSync("data/semesters/" + semesterName + ".json")) {
			data = fs.readFileSync("data/semesters/" + semesterName + ".json", "utf-8");
			sem1 = Object.assign(new Semester(), JSON.parse(data));
		} else {

			await interaction.followUp({
				content: "Semester given was not found.",
				ephemeral: true
			});
			return;
		}

		//console.log(sem1);
		// Create course object and add to semester.
		course1 = new Course(name, meetingLoc, meetingTime);
		console.log(course1);
		sem1.addCourse(course1);
		console.log(sem1);


		await interaction.followUp({
			content: "Course created!",
			ephemeral: true
		});
	},
};
