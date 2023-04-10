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

            async function Reaction (interaction){
                const roles=[];
                const reaction =[];
            
            const startID= 'studentx';
            
               for (i=1;i<=6;i++){
                roles.push(interaction.options.getRole(`student${i}`));
               } 
               for(i=1;i<roles.length;i++){
                if(roles[i]){
                    const newID = startID + i;
                    reaction.push(
                        new ButtonBuilder()
                        .setCustomId(newID)
                        .setLabel(`${student[i].name}`)
                        .setStyle(ButtonStyle.Secondary),
                    );
                }
               }
                const button = new ActionRowBuilder()
                .addComponents(reaction)
            
                const button2 = new ActionRowBuilder()
                        .addComponents (reaction) 
            
            
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
                ])

            const newID = interaction.options.getID('newID');
    
            role = Reaction(newID);
    
            if (!fs.existsSync("data/reaction/" + role.newID + ".json")) {
                fs.writeFileSync("data/reaction/" + role.newID + ".json", JSON.stringify(role, null, 2),"utf-8");
            } else {
                await interaction.followUp({
                    content: "Something went wrong",
                    ephemeral: true
                });
                return;
            }
    
            await interaction.followUp({
                content: "Role Assigned",
                ephemeral: true
            });
    
        await interaction.reply({ embeds: [embed], components: [button, button2]});
        
            }
    },
};


/*Take event listener code and put in util files so index file change even ready write in data create collector in store message id 
Prompt message.id  and store in a file multiple ids array or something
Fetch message and create new collector for that message 
 */