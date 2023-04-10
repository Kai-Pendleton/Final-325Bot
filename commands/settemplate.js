const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('settemplate')
		.setDescription('Sets the templates for all classes')
		.addChannelOption(option =>
			option.setName('template')
			.setDescription('Template category (Looks like a folder)'))
		.addChannelOption(option =>
			option.setName('optional-template')
			.setDescription('Optional channels category (Cannot be same as first option)'))
		.addRoleOption(option =>
			option.setName('template-student-role')
			.setDescription('Role that gets all the permissions a student would for the template channels')),
	async execute(interaction, client) {
		const templateCategory = interaction.options.getChannel("template");
		const optionalTemplateCategory = interaction.options.getChannel("optional-template");
		const templateStudentRole = interaction.options.getRole('template-student-role');
		const templateId = { id: templateCategory.id, optionalId: optionalTemplateCategory.id, roleId: templateStudentRole.id };
		fs.writeFileSync("data/templateId.json", JSON.stringify(templateId, null, 2),"utf-8");

		await interaction.reply({
			content: 'Templates set as ' + templateCategory.name + " and " + optionalTemplateCategory.name,
			ephemeral: true
		});
	},
};
