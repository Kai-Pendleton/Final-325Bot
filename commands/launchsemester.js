const { SlashCommandBuilder } = require('discord.js');
const { confirmButton } = require('../utils/confirmButton.js');
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

		// Confirmation Message
		if (!await confirmButton(interaction, "Are you sure you want to launch this semester?", "Launching Semester!")) {
			return;
		}

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

			semesterObject.courseList[courseIndex].studentRoleId = [];
			semesterObject.courseList[courseIndex].veteranRoleId = [];
			let course = semesterObject.courseList[courseIndex];

			for (let roleIndex in course.name) {
				const courseRoles = roleExist(course.name[roleIndex], interaction);
				let studentRole;
				let vetRole;
				if ( (courseRoles.student === undefined) && (courseRoles.veteran === undefined) ) { // Neither role exists. Make em.

					const pickColor = setColor();
					studentRole = await interaction.guild.roles.create({
						name: course.name[roleIndex] + " Students",
						permissions: interaction.guild.roles.everyone.permissions,
						color: pickColor.student 
					});

					vetRole = await interaction.guild.roles.create({
						name: course.name[roleIndex] + " Veteran",
						permissions: interaction.guild.roles.everyone.permissions,
						color: pickColor.veteran
					});

					courseRoles.student = studentRole;
					courseRoles.veteran = vetRole;

				} else if ( (courseRoles.student === undefined) != (courseRoles.veteran === undefined) )  {// One is found, but not the other

					const pickColor = setColor();
					studentRole = await interaction.guild.roles.create({
						name: course.name[roleIndex] + " Students",
						permissions: interaction.guild.roles.everyone.permissions,
						color: pickColor.student 
					});

					vetRole = await interaction.guild.roles.create({
						name: course.name[roleIndex] + " Veteran",
						permissions: interaction.guild.roles.everyone.permissions,
						color: pickColor.veteran
					});

					courseRoles.student = studentRole;
					courseRoles.veteran = vetRole;

					let warningContent = "Only one of student or veteran roles for " + course.name[roleIndex] + " was found. Check for duplicates and remove the oldest one.";
					await interaction.followUp({
						content: warningContent,
						ephemeral: true
					});

				} // else both roles are found, and their ids are already in courseRoles

				semesterObject.courseList[courseIndex].studentRoleId.push(courseRoles.student.id);
				semesterObject.courseList[courseIndex].veteranRoleId.push(courseRoles.veteran.id);

			}

			let categoryName = semesterObject.courseList[courseIndex].name[0];
			for (let nameIndex = 1; nameIndex < semesterObject.courseList[courseIndex].name.length; nameIndex++) {
				categoryName = categoryName + " / " + semesterObject.courseList[courseIndex].name[nameIndex];
			}

			let categoryOverwrites = [
				{
					id: client.user.id,
					allow: ["ViewChannel"],
				},
				{
					id: interaction.guild.roles.everyone,
					deny: ["ViewChannel"],
				},
			];

			for (let role of semesterObject.courseList[courseIndex].studentRoleId) {
				categoryOverwrites.push({
					id: role,
					allow: ["ViewChannel"],
				});
			}

			// Create new class category
			const duplicatedCategory = await interaction.guild.channels.create({
				name: categoryName + " - " + semesterName,
				type: 4, // 4 is category
				permissionOverwrites: categoryOverwrites,
			});

			// Assign categoryId of new category to course
			semesterObject.courseList[courseIndex].categoryId = duplicatedCategory.id;

			// Duplicate all original template channels into new category
			for (let i in templateChannelNames) {

				let templateChannel1 = await interaction.guild.channels.fetch(templateChannelIds[i]);
				let templateOverwrite = templateChannel1.permissionOverwrites.cache.get(allTemplateIds.roleId);//.find( element => element.id == templateStudentRole.id);
				let templatePermissions = {}
				if (templateOverwrite === undefined) {
					templatePermissions.allow = ["ViewChannel"];
					templatePermissions.deny = ["SendMessages"];
				} else {
					try {
						templatePermissions.allow = templateOverwrite.allow.toArray();
						templatePermissions.deny = templateOverwrite.deny.toArray();
					} catch (error) {
						console.error(error);
						console.log("Something failed when fetching template overwrites!");
					}
				}

				// TEMPLATE CHANNEL CANNOT HAVE "General Channel Permissions" AS PERMISSION OVERWRITES BESIDES "View Channel"
				// ONLY GIVE THE TEMPLATE STUDENT ROLE OVERWRITES FOR "Membership Permissions" and "Text Channel permissions"
				const duplicatedChannel = await interaction.guild.channels.create({
					name: templateChannelNames[i], // This will break if invalid channel name given.
					type: 0, // 0 is text channel
					parent: duplicatedCategory.id,
				});

				let channelOverwrites = [
					{
						id: client.user.id,
						allow: ["ViewChannel"],
					},
					{
						id: interaction.guild.roles.everyone,
						deny: ["ViewChannel"],
					},
				];

				for (let role of semesterObject.courseList[courseIndex].studentRoleId) {
					channelOverwrites.push({
						id: role,
						allow: templatePermissions.allow,
						deny: templatePermissions.deny,
					});
				}

				await duplicatedChannel.permissionOverwrites.set( channelOverwrites );

				let templateMessages = await templateChannel1.messages.fetch({ limit: 50 });
				templateMessages = Array.from(templateMessages.values());

				if (templateChannelNames[i] == "zoom-meeting-info") {
					await duplicatedChannel.send( { content: "Zoom address: " + semesterObject.courseList[courseIndex].meetLoc } );
					await duplicatedChannel.send( { content: "Class Time: " + semesterObject.courseList[courseIndex].meetTime } );
				}
				for (let j = templateMessages.length-1; j>=0; j--) {
					await duplicatedChannel.send({ content: templateMessages[j].content, embeds: templateMessages[j].embeds, files: Array.from(templateMessages[j].attachments.values()) });
				}

			}

			if (semesterObject.courseList[courseIndex].optionalChannels !== undefined && semesterObject.courseList[courseIndex].optionalChannels.length != 0) {
				for (let i in semesterObject.courseList[courseIndex].optionalChannels) {

					let templateChannel1 = await interaction.guild.channels.fetch(optionalChannelIds[i]);
					let templateOverwrite = templateChannel1.permissionOverwrites.cache.get(allTemplateIds.roleId);//.find( element => element.id == templateStudentRole.id);
					let templatePermissions = {}
					if (templateOverwrite === undefined) {
						templatePermissions.allow = ["ViewChannel"];
						templatePermissions.deny = ["SendMessages"];
					} else {
						try {
							templatePermissions.allow = templateOverwrite.allow.toArray();
							templatePermissions.deny = templateOverwrite.deny.toArray();
						} catch (error) {
							console.error(error);
							console.log("Something failed when fetching template overwrites!");
						}
					}

					const duplicatedChannel = await interaction.guild.channels.create({
						name: optionalChannelNames[i], // This will break if invalid channel name given.
						type: 0, // 0 is text channel
						parent: duplicatedCategory.id,
					});

					let channelOverwrites = [
						{
							id: client.user.id,
							allow: ["ViewChannel"],
						},
						{
							id: interaction.guild.roles.everyone,
							deny: ["ViewChannel"],
						},
					];

					for (let role of semesterObject.courseList[courseIndex].studentRoleId) {
						channelOverwrites.push({
							id: role,
							allow: templatePermissions.allow,
							deny: templatePermissions.deny,
						});
					}

					await duplicatedChannel.permissionOverwrites.set( channelOverwrites );
					
					let templateMessages = await templateChannel1.messages.fetch({ limit: 50 });
					templateMessages = Array.from(templateMessages.values());

					if (optionalChannelNames[i] == "zoom-meeting-info") {
						await duplicatedChannel.send( { content: "Zoom address: " + semesterObject.courseList[courseIndex].meetLoc } );
						await duplicatedChannel.send( { content: "Class Time: " + semesterObject.courseList[courseIndex].meetTime } );
					}
					for (let j = templateMessages.length-1; j>=0; j--) {
						await duplicatedChannel.send({ content: templateMessages[j].content, embeds: templateMessages[j].embeds, files: Array.from(templateMessages[j].attachments.values()) });
					}

				}
			}
		}

		interaction.followUp({
			content: "Semester launched!",
			ephemeral: true
		})
		// Update semester file
		semesterObject.updateFile();

	},
};

function roleExist(testRole, message)
{

	let studentRole = message.guild.roles.cache.find(studentRole => studentRole.name === testRole + " Students");
	let vetRole = message.guild.roles.cache.find(vetRole => vetRole.name === testRole + " Veteran");

	// will be undefined if not found
	return { student: studentRole, veteran: vetRole };

}

function setColor() {
	const findColors = require("../data/colors.json") 

	//const colorspath = path.join(__dirname, '..', 'data', "colors.json");
	//const data = json.parse(fs.readfilesync(colorspath, 'utf8'));
	const colorsUsed = findColors.inUse;
	const studentArray = findColors.student;
	const vetArray = findColors.veteran;

	let studentColor;
	let vetColor;
	

	for (let i = 0; i < findColors.inUse.length; i++)
	{
		if (findColors.inUse[i] == 0) {

			studentColor = studentArray[i];
			vetColor = vetArray[i];
			findColors.inUse[i] = 1;
			console.log(studentColor);
			console.log(vetColor);
			fs.writeFileSync("data/colors.json", JSON.stringify(findColors, null, 2), "utf-8");
			break;
		}
		else if (findColors.inUse[i] == 1 && i == findColors.inUse.length - 1)
		{
			//no colors left to use
			console.log("There are no colors left in colors.json!");
		}
		

	}

	//console.log(vetArray[1]);
	return {student: studentColor, veteran: vetColor};

}
