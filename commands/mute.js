const {SlashCommandBuilder} = require('@discordjs/builders')
const {MessageEmbed} = require('discord.js');
const IncidentManager = require('./init.js');
const Incident = require('../dataClasses/Incident.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mute')
        .setDescription('Hiermit kann einem Fahrer die Rechte zum Schreiben entfernt werden')
        .addUserOption(option => 
            option.setName('user1')
                .setDescription('User der Rechte verlieren soll')
                .setRequired(true))
        .addUserOption(option => 
            option.setName('user2')
                .setDescription('User der Rechte verlieren soll')
                .setRequired(false))
        .addUserOption(option => 
            option.setName('user3')
                .setDescription('User der Rechte verlieren soll')
                .setRequired(false))
        .addUserOption(option => 
            option.setName('user4')
                .setDescription('User der Rechte verlieren soll')
                .setRequired(false))
        .addUserOption(option => 
            option.setName('user5')
                .setDescription('User der Rechte verlieren soll')
                .setRequired(false)),

    async execute(client, interaction, command){

        //if(Steward Rolle)

        if(!(interaction.channel.name.includes('liga'))){
            interaction.reply('Vermutlich falscher Channel!');
            return
        }

        interaction.reply('Entfernung der Rechte wurde gestartet')

        const userToRemoveRights1 = interaction.options.getUser('user1')
        const userToRemoveRights2 = interaction.options.getUser('user2')
        const userToRemoveRights3 = interaction.options.getUser('user3')
        const userToRemoveRights4 = interaction.options.getUser('user4')
        const userToRemoveRights5 = interaction.options.getUser('user5')

        interaction.channel.permissionOverwrites.edit(userToRemoveRights1.id, { SEND_MESSAGES: false }).then(() => {
            if(userToRemoveRights2 != null){
                interaction.channel.permissionOverwrites.edit(userToRemoveRights2.id, { SEND_MESSAGES: false }).then(() => {
                    if(userToRemoveRights3 != null){
                        interaction.channel.permissionOverwrites.edit(userToRemoveRights3.id, { SEND_MESSAGES: false }).then(() => {
                            if(userToRemoveRights4 != null){
                                interaction.channel.permissionOverwrites.edit(userToRemoveRights4.id, { SEND_MESSAGES: false }).then(() => {
                                    if(userToRemoveRights5 != null){
                                        interaction.channel.permissionOverwrites.edit(userToRemoveRights5.id, { SEND_MESSAGES: false })
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