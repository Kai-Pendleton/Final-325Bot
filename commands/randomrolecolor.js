const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
//const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('randomrolecolor')
        .setDescription('assigns random role color'),
    async execute(interaction) {
        const roleColors = JSON.parse(fs.readFileSync('./role-colors.json')).colors; // utf-8?
        const usedColors = await interaction.guild.roles.cache.map(role => role.color);

        const availableColors = roleColors.filter(color => !usedColors.includes(color));

        if (availableColors.length === 0) {
            await interaction.channel.send('All colors have been used');
            return;
        }

        const randomIndex = Math.floor(Math.random() * availableColors.length);
        color = availableColors[randomIndex];

        const newRole = await interaction.guild.roles.create({
            data: {
                name: 'New_Role',
                color: "00FFFF"
            }
        })
            .then(async (role) => {
                await interaction.member.roles.add(role.id);
                await interaction.reply({
                    content:"Role created with a random color "
                });
            })
            .catch(async (err) => {
                console.error(err);
                await interaction.reply('There was an error creating the role');
            });
    },
};