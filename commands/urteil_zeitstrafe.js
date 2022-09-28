const {SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require('discord.js')
const IncidentManager = require('./init.js');

const btnRevision = new ButtonBuilder()
    .setLabel('Revision einlegen')
    .setCustomId('btnRevision')
    .setStyle(ButtonStyle.Danger)

module.exports = {
    data: new SlashCommandBuilder()
        .setName('urteil_zeitstrafe')
        .setDescription('Hiermit wird das Urteil veröffentlicht')
        .addBooleanOption(option => 
            option.setName('urteil')
                .setDescription('Hier muss eingetragen werden, ob die Strafe abgezogen wurde. True heißt Strafe wird abgezogen.')
                .setRequired(true))
        .addIntegerOption(option => 
            option.setName('strafe')
                .setDescription('Hier muss angegeben werden wie hoch die Starfe war. Bei 10 Sekunden einfach nur 10 eingeben')
                .setRequired(true)),

    async execute(client, interaction, command){

        const urteilBool = interaction.options.getBoolean('urteil');
        const strafeInt = interaction.options.getInteger('strafe')

        var tempIncidents = new Array();
        if(interaction.channel.name.includes('liga-1')){
            tempIncidents = IncidentManager.incidentManager.getIncidentsLiga1();
            strafenChannelID = IncidentManager.incidentManager.getStrafenChannelLiga1();
        } else if(interaction.channel.name.includes('liga-2')){
            tempIncidents = IncidentManager.incidentManager.getIncidentsLiga2();
            strafenChannelID = IncidentManager.incidentManager.getStrafenChannelLiga2();
        } else if(interaction.channel.name.includes('liga-3')){
            tempIncidents = IncidentManager.incidentManager.getIncidentsLiga3();
            strafenChannelID = IncidentManager.incidentManager.getStrafenChannelLiga3();
        }

        var incidentAtHand = null;

        tempIncidents.forEach((inc) => {
            if(inc.getChannel() == interaction.channel.id){
                incidentAtHand = inc;
            }
        }) 

        var driverPenalized = incidentAtHand.getInitiator();

        interaction.reply(`Urteil wurde gestartet`);

        //CHECK VALID

        if(urteilBool){
            interaction.channel.send({ content: `Die Zeitstrafe für ${driverPenalized} wurde abgezogen. ` +
                `**ACHTUNG, JEDER FAHRER HAT NUR 2 REVISIONEN PRO SAISON**, also nur den Knopf drücken, wenn ihr euch sicher seid.`,
                components: [new ActionRowBuilder().addComponents(btnRevision)]}).then(() => {

                

                interaction.guild.channels.cache.get(strafenChannelID).send(`${driverPenalized} bekommt seine ${strafeInt} Sekunden Strafe abgezogen.`).then(() => {
                    tempIncidents.forEach((inc) => {
                        if(interaction.channel.id == inc.getChannel().id){
                            var oldTitel = inc.getBaseName();
                            inc.setName(oldTitel + `-abgeschlossen`);
                            interaction.channel.setName(oldTitel + `-abgeschlossen`);
                        }
                    })
                })

               
                  
            })   
        } else {
            interaction.channel.send({ contents: `Die Zeitstrafe für ${driverPenalized} wurde nicht abgezogen. ` + 
                `**ACHTUNG, JEDER FAHRER HAT NUR 2 REVISIONEN PRO SAISON**, also nur den Knopf drücken, wenn ihr euchh sicher seid.`,
                components: [new ActionRowBuilder().addComponents(btnRevision)]}).then(() => {
                
                tempIncidents.forEach((inc) => {
                    if(interaction.channel.id == inc.getChannel().id){
                        var oldTitel = inc.getBaseName()
                        inc.setName(oldTitel + `-abgeschlossen`);
                        interaction.channel.setName(oldTitel + `-abgeschlossen`);
                    }
                })

            
                
            });
        }
    }  
}