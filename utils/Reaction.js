const {PermissionsBitField, ButtonStyle,ActionRowBuilder, ButtonBuilder, EmbedBuilder, ComponentType} = require('discord.js');

class Reaction{

    constructor(ID){
        this.ID= ID;
        this.input =[];
    }

    update(){

    let promptMsg = interaction.reply({ embeds: [embed], components: [button, button2]});

    let collector = promptMsg.createMessageComponentCollector({ componentType: ComponentType.Button });

        collector.on('collect', async (i) => {
            const member =i.member;

            if(i.customId === 'class1'){
                if (!member.roles.cache.has(student1.id)) {
                    member.roles.add(student1);
                    await i.reply({ content: 'Role added', ephemeral:true });
    
                } else {
                    member.roles.remove(student1);
                    await i.reply({ content: 'Role removed', ephemeral:true });
                }
            }else if (i.customId === 'class2') {
                if (!member.roles.cache.has(student2.id)) {
                    member.roles.add(student2);
                    await i.reply({ content: 'Role added', ephemeral:true });
                } else {
                    member.roles.remove(student2);
                    await i.reply({ content: 'Role removed', ephemeral:true });
                }
            }else if (i.customId === 'class3') {
                if (!member.roles.cache.has(student3.id)) {
                    member.roles.add(student3);
                    await i.reply({ content: 'Role added', ephemeral:true });
                } else {
                    member.roles.remove(student3);
                    await i.reply({ content: 'Role removed', ephemeral:true });
                }
            }else if (i.customId === 'class4') {
                if (!member.roles.cache.has(student4.id)) {
                    member.roles.add(student4);
                    await i.reply({ content: 'Role added', ephemeral:true });
                } else {
                    member.roles.remove(student4);
                    await i.reply({ content: 'Role removed', ephemeral:true });
                }
            }else if (i.customId === 'class5') {
    
                if (!member.roles.cache.has(student5.id)) {
                    member.roles.add(student5);
                    await i.reply({ content: 'Role added', ephemeral:true });
                } else {
                    member.roles.remove(student5);
                    await i.reply({ content: 'Role removed', ephemeral:true });
                }
            }
             else if (i.customId === 'class6') {
                
                if (!member.roles.cache.has(student6.id)) {
                    member.roles.add(student6);
                    await i.reply({ content: 'Role added', ephemeral:true });
                } else {
                    member.roles.remove(student6);
                    await i.reply({ content: 'Role removed', ephemeral:true });
                }}
    })}

};

    module.exports = { Reaction };