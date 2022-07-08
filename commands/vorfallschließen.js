const {SlashCommandBuilder} = require('@discordjs/builders')
const IncidentManager = require('./init.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('vorfallschließen')
        .setDescription('Verschiebt Kanal ins Archiv'),

    async execute(client, interaction, command){

        interaction.reply('Verschieben wurde gestartet')

        if(interaction.channel.name.includes('liga-1')){
            var tempIncidentsNew = IncidentManager.incidentManager.getIncidentsLiga1();

            tempIncidentsNew.forEach((inc) => {
                if(interaction.channel.id == inc.getChannel().id){
                    var tempChannel = inc.getChannel()
                    var tempDrivers = inc.getDriversInvolved();
                    var tempInitiator = inc.getInitiator();

                    tempDrivers.forEach((driver) => {
                        tempChannel.permissionOverwrites.edit(driver.id, { SEND_MESSAGES: false });
                    })

                    tempChannel.permissionOverwrites.edit(tempInitiator.id, { SEND_MESSAGES: false })
                }
            })
            interaction.channel.setParent(IncidentManager.incidentManager.getArchivLiga1());
        } else if(interaction.channel.name.includes('liga-2')){
            interaction.channel.setParent(IncidentManager.incidentManager.getArchivLiga2());
        } else if(interaction.channel.name.includes('liga-3')){
            interaction.channel.setParent(IncidentManager.incidentManager.getArchivLiga3());
        }
            
        
    }  
}