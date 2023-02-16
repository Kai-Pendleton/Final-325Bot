const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('duplicate')
		.setDescription('Duplicates a text channel')
		.addChannelOption(option =>
			option.setName('template')
			.setDescription('Channel to duplicate (Preceeded by #)'))
		.addStringOption(option =>
			option.setName('destination')
			.setDescription('Name of new channel (only lowercase, 0-9, and - allowed)')),

	async execute(interaction, client) {
		const template = interaction.options.getChannel('template');
		const destination = interaction.options.getString('destination');

		await interaction.reply({
			content: 'Duplicating channel!',
			ephemeral: true
		});

		const duplicatedChannel = await interaction.guild.channels.create({
			name: destination, // This will break if invalid channel name given.
			type: 0,
			permissionOverwrites: [{
				id: interaction.guild.id,
				allow: ["ViewChannel"],
			}]
		});

		var messages = await template.messages.fetch({ limit: 50 });
		messages = Array.from(messages.values());

		for (var i=messages.length-1; i>=0; i--) {
			await duplicatedChannel.send({ content: messages[i].content, embeds: messages[i].embeds, files: Array.from(messages[i].attachments.values()) });
		}

	},
};
