const {SlashCommandBuilder} = require('discord.js')
const IncidentManager = require('./init.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('vorfall_reopen')
        .setDescription('Verschiebt Kanal ins Archiv'),

    async execute(client, interaction, command){

        if(!interaction.member.roles.cache.has(IncidentManager.incidentManager.getRennleiterRolleID()) &&
            !interaction.member.roles.cache.has((IncidentManager.incidentManager.getStewardRolle()))){
            interaction.reply('Du hast keine Berechtigung diesen Command auszuführen')
            return;
        }else{
            var date = new Date().toLocaleString()
            console.log(`Der vorfall_reopen Command wurde von ${interaction.user.username} verwendet -- ${date}`)
        }

        interaction.reply('Vorfall wird wieder geöffnet')

        if(interaction.channel.name.includes('liga-1')){
           
            console.log(interaction.channel.permissionOverwrites)

            interaction.channel.permissionOverwrites.forEach((driver) => {
                interaction.channel.permissionOverwrites.edit(driver.id, { SEND_MESSAGES: true });
            })
            
                  
        } else if(interaction.channel.name.includes('liga-2')){
            var tempIncidentsNew = IncidentManager.incidentManager.getIncidentsLiga2();

            interaction.channel.setParent(IncidentManager.incidentManager.getVorfallKategorieID()).then(() => {
                tempIncidentsNew.forEach((inc) => {
                    if(interaction.channel.id == inc.getChannel().id){
                        var tempChannel = inc.getChannel()
                        var tempDrivers = inc.getDriversInvolved();
                        var tempInitiator = inc.getInitiator();
    
                        tempDrivers.forEach((driver) => {
                            tempChannel.permissionOverwrites.edit(driver.id, { SEND_MESSAGES: true });
                        })
    
                        tempChannel.permissionOverwrites.edit(tempInitiator.id, { SEND_MESSAGES: true })
                    }
                })
            });
        } else if(interaction.channel.name.includes('liga-3')){
            var tempIncidentsNew = IncidentManager.incidentManager.getIncidentsLiga3();

            interaction.channel.setParent(IncidentManager.incidentManager.getVorfallKategorieID()).then(() => {
                tempIncidentsNew.forEach((inc) => {
                    if(interaction.channel.id == inc.getChannel().id){
                        var tempChannel = inc.getChannel()
                        var tempDrivers = inc.getDriversInvolved();
                        var tempInitiator = inc.getInitiator();
    
                        tempDrivers.forEach((driver) => {
                            tempChannel.permissionOverwrites.edit(driver.id, { SEND_MESSAGES: true });
                        })
    
                        tempChannel.permissionOverwrites.edit(tempInitiator.id, { SEND_MESSAGES: true })
                    }
                })
            });
        }
            
        
    }  
}