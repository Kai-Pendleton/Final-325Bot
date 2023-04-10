const {PermissionsBitField, ButtonStyle,ActionRowBuilder, ButtonBuilder, EmbedBuilder, ComponentType,Message,Client} = require('discord.js');
const fs = require('fs');

class Reaction{
    constructor(id){
        this.id= id;
    }
    updateFile(){
        fs.writeFileSync("data/reaction/" + this.id + ".json", JSON.stringify(this, null, 2),"utf-8");
    }

    async startCollector(client){
        let guild= await client.guilds.fetch(this.guildId);
        console.log(guild)
        let channel = await guild.channels.fetch(this.message.channelId);
        this.message= await channel.fetch(this.message.id);
        //this.message=Object.assign(new Message(),this.message);
        console.log(this.message);

        let collector = this.message.createMessageComponentCollector({ componentType: ComponentType.Button });

        collector.on('collect', async (i) => {
            const member =i.member;
            let index=Number(i.customId.substr(7,i.customId.length));
            console.log(index);
            if (!member.roles.cache.has(this.roles[index])) {
                member.roles.add(this.roles[index]);
                await i.reply({ content: 'Role added', ephemeral:true });

            } else {
                member.roles.remove(this.roles[index]);
                await i.reply({ content: 'Role removed', ephemeral:true });
            }
            
            
    })}

};

    module.exports = Reaction;