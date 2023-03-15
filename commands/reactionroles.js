const {SlashCommandBuilder} = require('discord.js');
const {PermissionsBitField, ButtonStyle,ActionRowBuilder, ButtonBuilder, EmbedBuilder} = require('discord.js');

module.exports ={
    data: new SlashCommandBuilder ()
        .setName('reactionroles')
        .setDescription('This is the reaction role message command :)')
        .addRoleOption(option => option.setName(`student1`).setDescription('You now have the student1 role').setRequired(true))
        .addRoleOption(option => option.setName(`student2`).setDescription('You now have the student2 role').setRequired(true))
        .addRoleOption(option => option.setName(`student3`).setDescription('You now have the student3 role').setRequired(true))
        .addRoleOption(option => option.setName(`student4`).setDescription('You now have the student4 role').setRequired(true))
        .addRoleOption(option => option.setName(`student5`).setDescription('You now have the student5 role').setRequired(true))
        .addRoleOption(option => option.setName(`student6`).setDescription('You now have the student6 role').setRequired(true)),

    async execute (interaction,client){
        const student1 = interaction.options.getRole(`student1`);
        const student2 = interaction.options.getRole(`student2`);
        const student3 = interaction.options.getRole(`student3`);
        const student4 = interaction.options.getRole(`student4`);
        const student5 = interaction.options.getRole(`student5`);
        const student6 = interaction.options.getRole(`student6`);

        const button = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId(`class1`)
            .setLabel(`${student1.name}`)
            .setStyle(ButtonStyle.Secondary),

            new ButtonBuilder()
            .setCustomId(`class2`)
            .setLabel(`${student2.name}`)
            .setStyle(ButtonStyle.Secondary),

            new ButtonBuilder()
            .setCustomId(`class3`)
            .setLabel(`${student3.name}`)
            .setStyle(ButtonStyle.Secondary),

            new ButtonBuilder()
            .setCustomId(`class4`)
            .setLabel(`${student4.name}`)
            .setStyle(ButtonStyle.Secondary),

            new ButtonBuilder()
            .setCustomId(`class5`)
            .setLabel(`${student5.name}`)
            .setStyle(ButtonStyle.Secondary),

        );
        const button2 = new ActionRowBuilder()
				.addComponents (
					new ButtonBuilder()
					.setCustomId('class6')
					.setLabel(`${student6.name}`)
					.setStyle(ButtonStyle.Secondary),
				) 

        const embed = new EmbedBuilder()
        .setColor('DarkPurple')
        .setTitle('Course Selection')
        .setDescription(`React with the buttons below to get the specified roles! (${student1},${student2},${student3},${student4},${student5},${student6})`)
        
        await interaction.reply({ embeds: [embed], components: [button, button2]});

        const collector= await interaction.channel.createMessageComponentCollector();

        collector.on('collect', async (i) => {
            const member =i.member;

            if(i.customId === 'class1'){
                member.roles.add(student1);
                i.reply({content: `Role added`,ephemeral:true});
            }
            else if(i.customId === 'class2'){
                member.roles.add(student2);
                i.reply({content: `Role added`,ephemeral:true});
            }
            else if(i.customId === 'class3'){
                member.roles.add(student3);
                i.reply({content: `Role added`,ephemeral:true});
            }
            else if(i.customId === 'class4'){
                member.roles.add(student4);
                i.reply({content: `Role added`,ephemeral:true});
            }
            else if(i.customId === 'class5'){
                member.roles.add(student5);
                i.reply({content: `Role added`,ephemeral:true});
            }
            else if(i.customId === 'class6'){
                member.roles.add(student6);
                i.reply({content: `Role added`,ephemeral:true});
            }

        });


    },
};