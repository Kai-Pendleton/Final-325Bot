const { SlashCommandBuilder } = require('discord.js');
const { Permissions } = require('discord.js');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('create-role')
		.setDescription('Creates a new role with the given permissions.')
		.addStringOption(option =>
			option.setName('name')
				.setDescription('The name of the role.')
				.setRequired(true))
		.addRoleOption(option =>
			option.setName('permissions')
				.setDescription('The permissions to assign to the role.')
				.setRequired(true)),
	async execute(interaction) {
		const roleName = interaction.options.getString('name');
		const rolePermissions = interaction.options.getRole('permissions');

		const pickColor = setColor();
		try {
			const studentRole = await interaction.guild.roles.create({
				name: roleName+" Student",
				permissions: rolePermissions.permissions,
				color: pickColor.student 
			});

			const vetRole = await interaction.guild.roles.create({
				name: roleName+" Veteran",
				permissions: rolePermissions.permissions,
				color: pickColor.veteran
			});

			await interaction.reply(`Role ${studentRole.name} and ${vetRole.name} created with permissions ${studentRole.permissions.toArray().join(', ')}`);
		}

		catch (error) {
			console.error(error);
			await interaction.reply('There was an error creating the role.');
		}
	},


};


function roleExist(testRole,message)
{

	let studentRole = message.guild.roles.cache.find(studentRole => studentRole.name === testRole);
	let vetRole = message.guild.roles.cache.find(vetRole => vetRole.name === testRole + " Veteran");

	if (vetRole && studentRole) {

		return 0;
	}
	else if(!vetRole && studentRole) {

		return 1;
	}

	else if (vetRole && !studentRole) {

		return 2;
	}

	else
	{

		return 3;
	}

}

function setColor() {
	const findColors = require("../data/colors.json"); 

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
			fs.writeFileSync("data/colors.json", JSON.stringify(findColors, null, 2), "utf-8");
			break;
		}
		else if (findColors.inUse[i] == 1 && i == findColors.inUse.length - 1)
		{
			//no colors left to use
			console.log("There are no more colors left in colors.json!");
		}
		

	}

	return {student: studentColor, veteran: vetColor};

}

