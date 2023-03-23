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

		console.log(roleExist(roleName, interaction));
		const pickColor = setColor();
		try {
			const studentRole = await interaction.guild.roles.create({
				name: roleName,
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

		}
		

	}

	//console.log(vetArray[1]);
	return {student: studentColor, veteran: vetColor};

}



















/*module.exports = {
	data: new SlashCommandBuilder()
		.setName('createrole')
		.setDescription('Lets you create a new role with a color '),
	async execute(interaction, client) {
		await interaction.reply({
			content: 'Getting array!',
			ephemeral: true
		});
		try {
			const colorsPath = path.join(__dirname, '..', 'data', "colors.json");
			const data = JSON.parse(fs.readFileSync(colorsPath, 'utf8'));
			const StudentArray = data.student;
			const VetArray = data.veteran;
			console.log(VetArray[1]);

			interaction.guild.roles.create({
				data: {

					name: "Teacher",
					color: VetArray[1],
					permissions: [
						"ADMINISTRATOR",
						"MANAGE_MESSAGES",
						"KICK_MEMBERS",
						"BAN_MEMBERS"
					]



				}

			})





		} catch (err) {
			console.error(err);
		}
	},
};
*/