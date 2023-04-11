const {SlashCommandBuilder} = require('discord.js');
const {PermissionsBitField, ButtonStyle,ActionRowBuilder, ButtonBuilder, EmbedBuilder, ComponentType} = require('discord.js');
const Reaction = require('../utils/Reaction.js');
const fs = require('fs');

module.exports ={
    data: new SlashCommandBuilder ()
        .setName('reactionroles')
        .setDescription('Creates a message students can react to that will give them a specific role')
        .addRoleOption(option => option.setName(`student1`).setDescription('You now have the student1 role').setRequired(true))
        .addRoleOption(option => option.setName(`student2`).setDescription('You now have the student2 role').setRequired(false))
        .addRoleOption(option => option.setName(`student3`).setDescription('You now have the student3 role').setRequired(false))
        .addRoleOption(option => option.setName(`student4`).setDescription('You now have the student4 role').setRequired(false))
        .addRoleOption(option => option.setName(`student5`).setDescription('You now have the student5 role').setRequired(false))
        .addRoleOption(option => option.setName(`student6`).setDescription('You now have the student6 role').setRequired(false)),

        async execute(interaction, client) {

            let roles=[];
            let customid =[];
            
            const startID= 'student';
            console.log('1')
            let row = new ActionRowBuilder()
        
            let row2 = new ActionRowBuilder()
        
            for (i=0;i<6;i++){
                let role =interaction.options.getRole(`student${i}`);
                if(role!== null){
                    roles.push(role);
                }

            } 

            let currentrow =row;
            for(i=0;i<roles.length;i++){
                const newID = startID + i;
                currentrow.addComponents(
                    new ButtonBuilder()
                        .setCustomId(newID)
                        .setLabel(`${roles[i].name}`)
                        .setStyle(ButtonStyle.Secondary),
                );
                roles[i]=roles[i].id;
                customid.push(newID);

                if(i==4){
                    currentrow= row2;
                }
            }
            let allrows=[row];
            if (roles.length>5){
                allrows.push(row2);
            }
        
     

            const embed = new EmbedBuilder()
                .setColor('DarkPurple')
                .setTitle('Course Selection Menu')
                .addFields([
                    {
                        name: 'How to End Up in the Right Course',
                        value: "-Verify your schedule\n-Select the matching course from the buttons below\n-After making your selection you will recieve a message to know you were successfully added to your class\n-Lastly, double-check that you are in the correct course and have access to the correct channels",
                    },
                    {
                        name:"How to Remove Role",
                        value: "If you somehow end up in the wrong class just select that role again and you will recieve a message telling you that course was removed."
                    },
                    {
                        name: "IMPORTANT",
                        value: "Removing the student role DOES NOT equal dropping the course\nIf you would like to drop the course you will need to do it through SIS",
                    }
                ]);
                
            let promptMsg = await interaction.reply({embeds: [embed], components: allrows});

            promptMsg= await promptMsg.fetch();
    
            let reactionObj = new Reaction(promptMsg.id);
            reactionObj.customid=customid;
            reactionObj.roles=roles;
            reactionObj.message=promptMsg;
            reactionObj.guildId=interaction.guildId;
            reactionObj.updateFile();
            reactionObj.startCollector(client);

        }}
