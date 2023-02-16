const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('duplicate')
		.setDescription('Duplicates a text channel')
		.addChannelOption(option =>
			option.setName('template')
			.setDescription('Template class to duplicate (Looks like a folder)'))
		.addStringOption(option =>
			option.setName('destination')
			.setDescription('Name of new class (only lowercase, 0-9, and - allowed)')),

	async execute(interaction, client) {
		const template = interaction.options.getChannel('template');
		const destination = interaction.options.getString('destination');

		await interaction.reply({
			content: 'Duplicating channel!',
			ephemeral: true
		});

		// Grab all template channel ids and names
		templateChannelIds = [];
		templateChannelNames = [];
		for (channel of template.children.cache) {
    		templateChannelNames.push(channel[1].name);
    		templateChannelIds.push(channel[1].id);	
		}

		console.log(templateChannelNames);
		console.log(templateChannelIds);

		// Create new class category
		const duplicatedCategory = await interaction.guild.channels.create({
			name: destination,
			type: 4, // 4 is category
			permissionOverwrites: [{
				id: interaction.guild.id,
				allow: ["ViewChannel"],
			}]
		});
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
			duplicatedChannel.setParent(duplicatedCategory.id);

			var templateChannel1 = await interaction.guild.channels.fetch(templateChannelIds[i]);
			console.log(templateChannel1);
			var templateMessages = await templateChannel1.messages.fetch({ limit: 50 });
			console.log(templateMessages);
			templateMessages = Array.from(templateMessages.values());

			for (var j = templateMessages.length-1; j>=0; j--) {
				await duplicatedChannel.send({ content: templateMessages[j].content, embeds: templateMessages[j].embeds, files: Array.from(templateMessages[j].attachments.values()) });
			}

		}


	},
};
