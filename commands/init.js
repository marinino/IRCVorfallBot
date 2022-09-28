const {SlashCommandBuilder} = require('discord.js');
const IncidentManagers = require('../dataClasses/IncidentManager');

var incidentManager = new IncidentManagers();


module.exports = {
    incidentManager,
    data: new SlashCommandBuilder()
        .setName('init')
        .setDescription('Muss einmal ausgeführt werden um Bot zu starten')
        .addIntegerOption(option => 
            option.setName('startindex')
                .setDescription('Welche Nummer soll der erste Vorfall haben')
                .setRequired(true)),

    async execute(client, interaction, command){

        if(!interaction.member.roles.cache.has(incidentManager.getRennleiterRolleID())){
            interaction.reply('Permission denied')
            return;
        }else{
            console.log('all good')
        }

        const startIndex = interaction.options.getInteger('startindex')

        incidentManager.setCurrentIDLiga1(startIndex);

        interaction.reply('Vorfallbot gestartet');
    }  
}