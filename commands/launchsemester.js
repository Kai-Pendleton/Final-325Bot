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
		var allTemplateIds;
		if (fs.existsSync("data/templateId.json")) {
			data = fs.readFileSync("data/templateId.json", "utf-8");
			allTemplateIds = Object.assign(new Object(), JSON.parse(data));
		} else {
			await interaction.followUp({
				content: "Template not found. Please use /settemplate to set a channel category as the template.",
				ephemeral: true
			});
			return;
		}

		template = await interaction.guild.channels.fetch(allTemplateIds.id); // Main course template
		// TODO: Make sure courses cannot be initialized more than once.

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

		// Grab all template channel ids and names
		templateChannelIds = [];
		templateChannelNames = [];
		for (channel of template.children.cache) {
    		templateChannelNames.push(channel[1].name);
    		templateChannelIds.push(channel[1].id);	
		}


		// Runs this loop once for each course in the semester's courseList
		for (courseIndex in semesterObject.courseList) {
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
			for (var i = 0; i < templateChannelNames.length; i++) {

				const duplicatedChannel = await interaction.guild.channels.create({
					name: templateChannelNames[i], // This will break if invalid channel name given.
					type: 0, // 0 is text channel
					permissionOverwrites: [{
						id: interaction.guild.id,
						allow: ["ViewChannel"],
					}]
				});
				await duplicatedChannel.setParent(duplicatedCategory.id);

				var templateChannel1 = await interaction.guild.channels.fetch(templateChannelIds[i]);
				var templateMessages = await templateChannel1.messages.fetch({ limit: 50 });
				templateMessages = Array.from(templateMessages.values());

				for (var j = templateMessages.length-1; j>=0; j--) {
					await duplicatedChannel.send({ content: templateMessages[j].content, embeds: templateMessages[j].embeds, files: Array.from(templateMessages[j].attachments.values()) });
				}

			}
		}

		// Update semester file
		semesterObject.updateFile();

	},
};
