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
		let allTemplateIds;
		if (fs.existsSync("data/templateId.json")) {
			allTemplateIds = require('../data/templateId.json');
		} else {
			await interaction.followUp({
				content: "Template not found. Please use /settemplate to set a channel category as the template.",
				ephemeral: true
			});
			return;
		}

		let optionalChannelsCategory = await interaction.guild.channels.fetch(allTemplateIds.optionalId); // Main course template

		// Grab all optional channel ids and names
		let optionalChannelIds = [];
		let optionalChannelNames = [];
		for (channel of optionalChannelsCategory.children.cache) {
    		optionalChannelNames.push(channel[1].name);
    		optionalChannelIds.push(channel[1].id);	
		}

		let row1 = new ActionRowBuilder();
		let row2 = new ActionRowBuilder();
		let row3 = new ActionRowBuilder();
		let row4 = new ActionRowBuilder();
		let row5 = new ActionRowBuilder();

		// Initialize Buttons
		for (let index in optionalChannelNames) {
			if (index > 2) {
				if (index > 7){
					if (index > 12){
						if (index > 17){
							if (index > 22) {
								interaction.followUp({
									content: "You have more than 23 optional channels. This is above the maximum. Please reduce the number of optional channels and try again.",
									ephemeral: true
								});
								return;
							}
							// Optional channels 19-23 inclusive, use row 5
							row5.addComponents(
								new ButtonBuilder()
									.setCustomId(index.toString())
									.setLabel(`${optionalChannelNames[index]}`)
									.setStyle(ButtonStyle.Primary),
								);

							continue;
						}
						// Optional channels 14-18 inclusive, use row 4
						row4.addComponents(
							new ButtonBuilder()
								.setCustomId(index.toString())
								.setLabel(`${optionalChannelNames[index]}`)
								.setStyle(ButtonStyle.Primary),
							);

						continue;
					}
					// Optional channels 9-13 inclusive, use row 3
					row3.addComponents(
						new ButtonBuilder()
							.setCustomId(index.toString())
							.setLabel(`${optionalChannelNames[index]}`)
							.setStyle(ButtonStyle.Primary),
						);

					continue;
				}
				// Optional channels 4-8 inclusive, use row 2
				row2.addComponents(
					new ButtonBuilder()
						.setCustomId(index.toString())
						.setLabel(`${optionalChannelNames[index]}`)
						.setStyle(ButtonStyle.Primary),
					);

				continue;
			}
			// First 3 optional channels, use row 1
			row1.addComponents(
				new ButtonBuilder()
					.setCustomId(index.toString())
					.setLabel(`${optionalChannelNames[index]}`)
					.setStyle(ButtonStyle.Primary),
				);

		}

		row1.addComponents(
				new ButtonBuilder()
					.setCustomId('Add')
					.setLabel('Add the course!')
					.setStyle(ButtonStyle.Success),
				new ButtonBuilder()
					.setCustomId('Cancel')
					.setLabel('Cancel!')
					.setStyle(ButtonStyle.Danger),
			);

		let actionRowList = [row1];
		if (row2.components.length > 0) actionRowList.push(row2);
		if (row3.components.length > 0) actionRowList.push(row3);
		if (row4.components.length > 0) actionRowList.push(row4);
		if (row5.components.length > 0) actionRowList.push(row5);

		let promptMsg = await interaction.editReply({
			content: "What optional channels does " + name + " require?",
			components: actionRowList,
			ephemeral: true
		});

		const collector = promptMsg.createMessageComponentCollector({ componentType: ComponentType.Button, time: 50000 });
		let endFlag = false;
		let optionalChannelsList = [];

		collector.on('collect', async i => {
			if (i.user.id === interaction.user.id) {
				switch (i.customId) {
				case "Add":

					for (let optIndex in optionalChannelsList) {
						optionalChannelsList[optIndex] = optionalChannelIds[Number(optionalChannelsList[optIndex])];
					}

					// Create course object and add to semester.
					course1 = new Course(name, meetingLoc, meetingTime, optionalChannelsList);
					sem1.addCourse(course1);
					i.reply({
						content: "Course created!",
						ephemeral: true
					});
					endFlag = true;
					collector.stop();
					break;
				case "Cancel":
					i.reply({
						content: "Action canceled.",
						ephemeral: true
					});
					endFlag = true;
					collector.stop();
					break;
				default:
					let index = i.customId;
					for (actionRow of actionRowList){
						for (button of actionRow.components) {
							console.log(button.data.custom_id);
							if (i.customId == button.data.custom_id) {
								button.setDisabled(true);
								promptMsg = await interaction.editReply({
									content: "What optional channels does " + name + " require?",
									components: actionRowList,
									ephemeral: true
								});

								optionalChannelsList.push(Number(i.customId));
							}
						}
					}
					// Silently reply to interaction to prevent error.
					i.deferUpdate();

				}
			} else {
				i.reply({ content: `These buttons aren't for you!`, ephemeral: true });
			}
		});

		collector.on('end', collected => {
			if (!endFlag) {
				interaction.followUp({
					content: "Command timed out. Please run again.",
					ephemeral: true
				});
			}
		});


		
	},
};