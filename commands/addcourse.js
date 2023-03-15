const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Events, ComponentType } = require('discord.js');
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

		// Check if course already exists.
		for (course of sem1.courseList) {
			if (course.name == name) {
				await interaction.followUp({
				content: "Course already exists.",
				ephemeral: true
			});
			return;
			}
		}

		// Retrieve optional channels from template id in templateId.json
		var allTemplateIds;
		if (fs.existsSync("data/templateId.json")) {
			allTemplateIds = require('../data/templateId.json');
		} else {
			await interaction.followUp({
				content: "Template not found. Please use /settemplate to set a channel category as the template.",
				ephemeral: true
			});
			return;
		}

		optionalChannelsCategory = await interaction.guild.channels.fetch(allTemplateIds.optionalId); // Main course template

		// Grab all optional channel ids and names
		optionalChannelIds = [];
		optionalChannelNames = [];
		for (channel of optionalChannelsCategory.children.cache) {
    		optionalChannelNames.push(channel[1].name);
    		optionalChannelIds.push(channel[1].id);	
    		console.log(channel[1].name);
		}

		const row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('Add')
					.setLabel('Add the course!')
					.setStyle(ButtonStyle.Success),
				new ButtonBuilder()
					.setCustomId('Cancel')
					.setLabel('Cancel!')
					.setStyle(ButtonStyle.Danger),
			);
		const promptMsg = await interaction.followUp({
			content: "What optional channels does " + name + " require?",
			components: [row],
			ephemeral: true
		});

		const collector = promptMsg.createMessageComponentCollector({ componentType: ComponentType.Button, time: 30000 });

		collector.on('collect', i => {
			if (i.user.id === interaction.user.id) {
				switch (i.customId) {
				case "Add":
					// Create course object and add to semester.
					course1 = new Course(name, meetingLoc, meetingTime);
					sem1.addCourse(course1);
					i.reply({
						content: "Course created!",
						ephemeral: true
					});
					collector.stop();
					break;
				case "Cancel":
					i.reply({
						content: "Action canceled.",
						ephemeral: true
					});
					collector.stop();
					break;
				default:
					i.reply("Something went wrong with this command.");
					console.log("${i.customId} button pressed but not handled.")
				}
			} else {
				i.reply({ content: `These buttons aren't for you!`, ephemeral: true });
			}
		});

		collector.on('end', collected => {
			if (collected.size == 0) {
				interaction.followUp({
					content: "Command timed out. Please run again.",
					ephemeral: true
				});
			}
		});


		
	},
};