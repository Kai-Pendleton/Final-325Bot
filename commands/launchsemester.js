const { SlashCommandBuilder } = require('discord.js');
const Semester = require('../utils/Semester.js');
const Course = require('../utils/Course.js');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('launchsemester')
		.setDescription('Initializes all categories and channels for a given semester.')
		.addStringOption(option =>
			option.setName('semester')
			.setDescription('Name of semester to be launched.')),

	async execute(interaction, client) {
		const semesterName = interaction.options.getString('semester');

		await interaction.reply({
			content: 'Launching ' + semesterName + '!',
			ephemeral: true
		});

		// Read template category id from file
		let allTemplateIds;
		if (fs.existsSync("data/templateId.json")) {
			let data = fs.readFileSync("data/templateId.json", "utf-8");
			allTemplateIds = Object.assign(new Object(), JSON.parse(data));
		} else {
			await interaction.followUp({
				content: "Template not found. Please use /settemplate to set a channel category as the template.",
				ephemeral: true
			});
			return;
		}

		// Read semester object from file
		let semesterObject;
		if (fs.existsSync("data/semesters/" + semesterName + ".json")) {
			let data = fs.readFileSync("data/semesters/" + semesterName + ".json", "utf-8");
			semesterObject = Object.assign(new Semester(), JSON.parse(data));
		} else {

			await interaction.followUp({
				content: "Semester given was not found.",
				ephemeral: true
			});
			return;
		}

		let template = await interaction.guild.channels.fetch(allTemplateIds.id); // Main course template
		// TODO: Make sure courses cannot be initialized more than once.
		// Grab all template channel ids and names
		let templateChannelIds = [];
		let templateChannelNames = [];
		for (let channel of template.children.cache) {
    		templateChannelNames.push(channel[1].name);
    		templateChannelIds.push(channel[1].id);	
		}

		let optionalChannelsCategory = await interaction.guild.channels.fetch(allTemplateIds.optionalId); // Main course template
		// Grab all optional channel ids and names
		let optionalChannelIds = [];
		let optionalChannelNames = [];
		for (channel of optionalChannelsCategory.children.cache) {
    		optionalChannelNames.push(channel[1].name);
    		optionalChannelIds.push(channel[1].id);	
		}


		// Runs this loop once for each course in the semester's courseList
		for (let courseIndex in semesterObject.courseList) {
			// Create new class category
			const duplicatedCategory = await interaction.guild.channels.create({
				name: semesterObject.courseList[courseIndex].name + " - " + semesterName,
				type: 4, // 4 is category
				permissionOverwrites: [{
					id: interaction.guild.id,
					allow: ["ViewChannel"],
				}]
			});

			// Assign categoryId of new category to course
			semesterObject.courseList[courseIndex].categoryId = duplicatedCategory.id;

			// Duplicate all original template channels into new category
			for (let i in templateChannelNames) {

				const duplicatedChannel = await interaction.guild.channels.create({
					name: templateChannelNames[i], // This will break if invalid channel name given.
					type: 0, // 0 is text channel
					permissionOverwrites: [{
						id: interaction.guild.id,
						allow: ["ViewChannel"],
					}]
				});
				await duplicatedChannel.setParent(duplicatedCategory.id);

				let templateChannel1 = await interaction.guild.channels.fetch(templateChannelIds[i]);
				let templateMessages = await templateChannel1.messages.fetch({ limit: 50 });
				templateMessages = Array.from(templateMessages.values());

				for (let j = templateMessages.length-1; j>=0; j--) {
					await duplicatedChannel.send({ content: templateMessages[j].content, embeds: templateMessages[j].embeds, files: Array.from(templateMessages[j].attachments.values()) });
				}

			}

			if (semesterObject.courseList[courseIndex].optionalChannels !== undefined && semesterObject.courseList[courseIndex].optionalChannels.length != 0) {
				for (let i in semesterObject.courseList[courseIndex].optionalChannels) {

					const duplicatedChannel = await interaction.guild.channels.create({
						name: optionalChannelNames[i], // This will break if invalid channel name given.
						type: 0, // 0 is text channel
						permissionOverwrites: [{
							id: interaction.guild.id,
							allow: ["ViewChannel"],
						}]
					});
					await duplicatedChannel.setParent(duplicatedCategory.id);

					let templateChannel1 = await interaction.guild.channels.fetch(optionalChannelIds[i]);
					let templateMessages = await templateChannel1.messages.fetch({ limit: 50 });
					templateMessages = Array.from(templateMessages.values());

					for (let j = templateMessages.length-1; j>=0; j--) {
						await duplicatedChannel.send({ content: templateMessages[j].content, embeds: templateMessages[j].embeds, files: Array.from(templateMessages[j].attachments.values()) });
					}

				}
			}
		}

		// Update semester file
		semesterObject.updateFile();

	},
};
