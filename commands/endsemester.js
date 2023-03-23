const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Events, ComponentType } = require('discord.js');
const Semester = require('../utils/Semester.js');
const Course = require('../utils/Course.js');
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

		await interaction.reply({
			content: '___',
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


		const row1 = new ActionRowBuilder().addComponents(
			new ButtonBuilder()
				.setCustomId('Confirm')
				.setLabel('Confirm!')
				.setStyle(ButtonStyle.Success),
			new ButtonBuilder()
				.setCustomId('Cancel')
				.setLabel('Cancel!')
				.setStyle(ButtonStyle.Danger),
		);

		const promptMsg = await interaction.editReply({
			content: "Are you sure you want to archive this semester?",
			components: [row1],
			ephemeral: true
		});


		const collector = promptMsg.createMessageComponentCollector({ componentType: ComponentType.Button, time: 50000 });
		let endFlag = false;

		collector.on('collect', async i => {
			if (i.user.id === interaction.user.id) {
				switch (i.customId) {
					case "Confirm":


						// Runs this loop once for each course in the semester's courseList
						for (courseIndex in semesterObject.courseList) {

							const category = await interaction.guild.channels.fetch(semesterObject.courseList[courseIndex].categoryId);
							await category.permissionOverwrites.delete(semesterObject.courseList[courseIndex].studentRoleId); // Remove viewing permissions.
							
							const studentArray = await interaction.guild.roles.cache.get(semesterObject.courseList[courseIndex].studentRoleId).members;
							for (student of studentArray) {
								student[1].roles.add(semesterObject.courseList[courseIndex].veteranRoleId);
								student[1].roles.remove(semesterObject.courseList[courseIndex].studentRoleId);
							}

						}

						i.reply({
							content: "Semester archived!",
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

//const row1 = new ActionRowBuilder().addComponents(
//		new ButtonBuilder()
//			.setCustomId('Confirm')
//			.setLabel('Confirm!')
//			.setStyle(ButtonStyle.Success),
//		new ButtonBuilder()
//			.setCustomId('Cancel')
//			.setLabel('Cancel!')
//			.setStyle(ButtonStyle.Danger),
//	);

//const promptMsg = await interaction.editReply({
//	content: "Are you sure you want to delete this semester?",
//	components: [row1],
//	ephemeral: true
//});


//const collector = promptMsg.createMessageComponentCollector({ componentType: ComponentType.Button, time: 50000 });

//collector.on('collect', async i => {
//	if (i.user.id === interaction.user.id) {
//		switch (i.customId) {
//			case "Confirm":

//				i.reply({
//					content: "Semester removed!",
//					ephemeral: true
//				});
//				collector.stop();
//				break;
//			case "Cancel":
//				i.reply({
//					content: "Action canceled.",
//					ephemeral: true
//				});
//				collector.stop();
//				break;
//			default:

//				// Silently reply to interaction to prevent error.
//				i.deferUpdate();

//		}
//	} else {
//		i.reply({ content: `These buttons aren't for you!`, ephemeral: true });
//	}
//});

//collector.on('end', collected => {
//	if (!endFlag) {
//		interaction.followUp({
//			content: "Command timed out. Please run again.",
//			ephemeral: true
//		});
//	}
//});
