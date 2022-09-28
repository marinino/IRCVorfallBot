const {SlashCommandBuilder} = require('discord.js')
const IncidentManager = require('./init.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('vorfall_schließen')
        .setDescription('Verschiebt Kanal ins Archiv'),

    async execute(client, interaction, command){

        interaction.reply('Verschieben wurde gestartet')

        if(interaction.channel.name.includes('liga-1')){
           
            console.log(Array.from(interaction.channel.permissionOverwrites.cache))

            interaction.channel.setParent(IncidentManager.incidentManager.getArchivLiga1()).then(() => {
                

                interaction.channel.permissionOverwrites.forEach((driver) => {
                    interaction.channel.permissionOverwrites.edit(driver.id, { SendMessages: false });
                })
            });
        } else if(interaction.channel.name.includes('liga-2')){
            interaction.channel.setParent(IncidentManager.incidentManager.getArchivLiga2());
        } else if(interaction.channel.name.includes('liga-3')){
            interaction.channel.setParent(IncidentManager.incidentManager.getArchivLiga3());
        }
            
        
    }  
}