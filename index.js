require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Client, Collection, Events, GatewayIntentBits, EmbedBuilder, PermissionsBitField, Permissions } = require('discord.js');

const token = process.env.TOKEN;
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

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
});

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.on('messageCreate', async (msg) => {

	if (msg.channel.name === "kai-bot-test") { //Change this name to your own testing channel name
		
		splitCommand = msg.content.split(" ");

		if (splitCommand[0] === '!createRole') {

            msg.guild.roles.create({
                //data: {  color: 'FF0000' }
                name: splitCommand[1], //splitCommand[1],
                color: splitCommand[2],
                //permissions: ['SEND_MESSAGES', 'VIEW_CHANNEL']

            }).then(roles => console.log("Created new role with name " + splitCommand[1])).catch(console.error);
        }
	}
});

// Log our bot in using the token from dev portal
client.login(token);
