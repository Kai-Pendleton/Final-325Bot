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

		//console.log(roleExist(roleName, interaction));
		//checkColor(interaction);
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
			//console.log(studentColor);
			//console.log(vetColor);
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





//function checkColor(message) {
//	//onst findColors = require("../data/colors.json");
//	const allColors = JSON.parse(fs.readFileSync('data/colors.json', 'utf8'));
//	const filteredRoles = message.guild.roles.cache.filter( role => role.name.toLowerCase().includes("student") );


//	let notUsed = [];
//	let index = 0;
//	let cutOff;

//	for (let i = 0; allColors.inUse[i] == 1; i++) {

	
//		cutOff = i;

//	}

//	let j = 0;
//	for (let role of filteredRoles.values()) {

//		console.log("testing color " + role.hexColor + "\n --------");
//		console.log("cutOFF = " + cutOff + "\n");

//		if ((role.hexColor != allColors.student[j])) {

//			for (let i = 0; allColors.inUse[i] == 1; i++) {

//				console.log("i = " + i);
//				if (role.hexColor == allColors.student[i]) {
//					console.log(cutOff + " > " + i)
//					j++;
				

//				}

//				else if(cutOff <= i){
//					console.log(cutOff + " <= " + i)
//					console.log(role.hexColor);
//					notUsed[index] = role.hexColor;
//					index++;
					
//				}






//			}

//		}
//		j++;
	
		
		
	
//	}

//	for (let i = 0; allColors.inUse[i] == 1; i++) {

//		for (let j = 0; j < notUsed.length; i++) {

//			if (allColors.student[i] == notUsed[j]) {

//				allColors.inUse[i] = 0;
//				fs.writeFileSync("data/colors.json", JSON.stringify(findColors, null, 2), "utf-8");

//			}

//		}

//	}


//	//console.log(roleColors);
//}














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