require('dotenv').config();
const fs = require('fs');
const path = require('path');
const Reaction = require('./utils/Reaction.js');
const { Client, Collection, Events, GatewayIntentBits, EmbedBuilder, PermissionsBitField, Permissions } = require('discord.js');

const token = process.env.TOKEN;
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers] });

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

client.on('ready', () => {
	console.log('Logged in as ' + client.user.tag +'!');
	fs.readdirSync("data/reaction/").forEach(file => {
		if (file === ".gitignore") return; // in forEach(), return == continue
		let data = fs.readFileSync("data/reaction/"+ file, "utf-8");
		let reactionObject = Object.assign(new Reaction(), JSON.parse(data));
		reactionObject.startCollector(client);
	});

});

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	if (!interaction.member.permissionsIn(interaction.channel).has(PermissionsBitField.Flags.Administrator)) {
		interaction.reply({
			content: "You must be an administrator to use this bot!",
			ephemeral: true
		});
		return;
	}

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction, client);
	} catch (error) {
		console.error(error);
		await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

// Log our bot in using the token from dev portal
client.login(token);
