const {SlashCommandBuilder, MessageEmbed} = require('discord.js');

const IncidentManager = require('./init.js');
const Incident = require('../dataClasses/Incident.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unmute')
        .setDescription('Hiermit kann einem Fahrer die Rechte zum Schreiben wieder bekommen')
        .addUserOption(option => 
            option.setName('user1')
                .setDescription('User der Rechte bekommen soll')
                .setRequired(true))
        .addUserOption(option => 
            option.setName('user2')
                .setDescription('User der Rechte bekommen soll')
                .setRequired(false))
        .addUserOption(option => 
            option.setName('user3')
                .setDescription('User der Rechte bekommen soll')
                .setRequired(false))
        .addUserOption(option => 
            option.setName('user4')
                .setDescription('User der Rechte bekommen soll')
                .setRequired(false))
        .addUserOption(option => 
            option.setName('user5')
                .setDescription('User der Rechte bekommen soll')
                .setRequired(false)),

    async execute(client, interaction, command){

        //if(Steward Rolle)

        if(!(interaction.channel.name.includes('liga'))){
            interaction.reply('Vermutlich falscher Channel!');
            return
        }

        interaction.reply('Entfernung der Rechte wurde gestartet')

        const userToGetRights1 = interaction.options.getUser('user1')
        const userToGetRights2 = interaction.options.getUser('user2')
        const userToGetRights3 = interaction.options.getUser('user3')
        const userToGetRights4 = interaction.options.getUser('user4')
        const userToGetRights5 = interaction.options.getUser('user5')

        interaction.channel.permissionOverwrites.edit(userToGetRights1.id, { SEND_MESSAGES: true }).then(() => {
            if(userToGetRights2 != null){
                interaction.channel.permissionOverwrites.edit(userToGetRights2.id, { SEND_MESSAGES: true }).then(() => {
                    if(userToGetRights3 != null){
                        interaction.channel.permissionOverwrites.edit(userToGetRights3.id, { SEND_MESSAGES: true }).then(() => {
                            if(userToGetRights4 != null){
                                interaction.channel.permissionOverwrites.edit(userToGetRights4.id, { SEND_MESSAGES: true }).then(() => {
                                    if(userToGetRights5 != null){
                                        interaction.channel.permissionOverwrites.edit(userToGetRights5.id, { SEND_MESSAGES: true })
                                    }
                                })
                            }
                        })
                    }
                })
            }
        })

    }  
}