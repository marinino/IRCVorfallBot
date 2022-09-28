const {SlashCommandBuilder, MessageEmbed} = require('discord.js');

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

        await interaction.channel.permissionOverwrites.edit(userToRemoveRights1.id, { SendMessages: false })
        if(userToRemoveRights2 != null){
            await interaction.channel.permissionOverwrites.edit(userToRemoveRights2.id, { SendMessages: false })
        }
        if(userToRemoveRights3 != null){
            await interaction.channel.permissionOverwrites.edit(userToRemoveRights3.id, { SendMessages: false })
        }
        if(userToRemoveRights4 != null){
            await interaction.channel.permissionOverwrites.edit(userToRemoveRights4.id, { SendMessages: false })
        }   
        if(userToRemoveRights5 != null){
            await interaction.channel.permissionOverwrites.edit(userToRemoveRights5.id, { SendMessages: false })
        }

    }  
}