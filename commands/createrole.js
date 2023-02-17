const { SlashCommandBuilder } = require('discord.js');
const { Permissions } = require('discord.js');
//const fs = require('fs');



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

		try {
			const newRole = await interaction.guild.roles.create({
				name: roleName,
				permissions: rolePermissions.permissions,
			});

			await interaction.reply(`Role ${newRole.name} created with permissions ${newRole.permissions.toArray().join(', ')}`);
		} catch (error) {
			console.error(error);
			await interaction.reply('There was an error creating the role.');
		}
	},
};




















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