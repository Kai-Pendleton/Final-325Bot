require('dotenv').config()
const { Client, GatewayIntentBits, EmbedBuilder, PermissionsBitField, Permissions } = require('discord.js');

const token = process.env.TOKEN;
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.on('ready', () => {
	console.log('Logged in as ' + client.user.tag +'!');
});

client.on('messageCreate', (msg) => {
	if (msg.content.toLowerCase() === 'ping') {
		msg.reply('Pong!')
	} else if (msg.content.toLowerCase() === "channel") {
		msg.guild.channels.create({
			name: "channel-name-test",
			type: 0,
			permissionOverwrites: [{
				id: msg.guild.id,
				allow: ["ViewChannel"],
			}]
		});
		msg.channel.send("Channel created!");

	}
});

// Log our bot in using the token from dev portal
client.login(token);
