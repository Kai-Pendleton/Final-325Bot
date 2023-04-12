const { ActionRowBuilder, ButtonBuilder, ButtonStyle, Events, ComponentType } = require('discord.js');


async function confirmButton(interaction, promptString, confirmString) {

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



	let promptMsg = await interaction.reply({
		content: promptString,
		components: [row1],
		ephemeral: true
	});


	let collector = promptMsg.createMessageComponentCollector({ componentType: ComponentType.Button, time: 50000 });
	let endFlag = false;
	const deferred = [];
	let promise = new Promise(function (resolve, reject) {
		deferred.push({
			resolve: resolve,
			reject: reject
		});
	});

	collector.on('collect', async i => {
		if (i.user.id === interaction.user.id) {
			switch (i.customId) {
				case "Confirm":
					await i.reply({
						content: confirmString,
						ephemeral: true
					});
					//confirmed = true;
					endFlag = true;
					collector.stop();
					deferred[0].resolve(true);
					break;
				case "Cancel":
					i.reply({
						content: "Action canceled.",
						ephemeral: true
					});
					confirmed = false;
					endFlag = true;
					collector.stop();
					deferred[0].resolve(false);
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
			deferred[0].resolve(false);
		}
	});

	return promise;

}


module.exports = { confirmButton };