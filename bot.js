require('dotenv').config()
const { Client, GatewayIntentBits, EmbedBuilder, PermissionsBitField, Permissions } = require('discord.js');

const token = process.env.TOKEN;
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.on('ready', () => {
	console.log('Logged in as ' + client.user.tag +'!');
});

client.on('messageCreate', (msg) => {

	if (msg.channel.name === "kai-bot-test") { //Change this name to your own testing channel name
		splitCommand = msg.content.split(" ");

		if (splitCommand[0] === '!ping') {
			msg.reply('Pong!')
		} else if (splitCommand[0] === "!channel") {

			msg.guild.channels.create({
				name: splitCommand[1], // This will break if invalid channel name given.s
				type: 0,
				permissionOverwrites: [{
					id: msg.guild.id,
					allow: ["ViewChannel"],
				}]
			});
			msg.channel.send("Channel created!");
		}
	}
});

// Log our bot in using the token from dev portal
client.login(token);
