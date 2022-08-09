const {SlashCommandBuilder} = require('@discordjs/builders')
const IncidentManager = require('./init.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('urteil_zeitstrafe')
        .setDescription('Hiermit wird das Urteil veröffentlicht')
        .addBooleanOption(option => 
            option.setName('urteil')
                .setDescription('Hier muss eingetragen werden, ob die Strafe abgezogen wurde oder nicht')
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
        } else if(interaction.channel.name.includes('liga-2')){
            tempIncidents = IncidentManager.incidentManager.getIncidentsLiga2();
        } else if(interaction.channel.name.includes('liga-3')){
            tempIncidents = IncidentManager.incidentManager.getIncidentsLiga3();
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
            interaction.channel.send(`Die Zeitstrafe für ${driverPenalized} wurde abgezogen. Für Revision ` + 
                `mit ${IncidentManager.incidentManager.getDenyEmoji()} reagieren`).then((messageUrteil) => {

                tempIncidents.forEach((inc) => {
                    if(interaction.channel.id == inc.getChannel().id){
                        var oldTitel = inc.getBaseName();
                        inc.setName(oldTitel + `-abgeschlossen`);
                        interaction.channel.setName(oldTitel + `-abgeschlossen`);
                    }
                })

                interaction.guild.channels.cache.get(IncidentManager.incidentManager.getStrafenChannelLiga1()).send(`${driverPenalized} wird ` + 
                    `seine ${strafeInt} Sekunden Strafe abgezogen.`).then(() => {

                    const filter = (reaction, user) => {
                        console.log(driverPenalized.id + '  ' + user.id)
                        return driverPenalized.id == user.id && reaction.emoji.name == IncidentManager.incidentManager.getDenyEmoji()
                    }
                    
                    messageUrteil.react(IncidentManager.incidentManager.getDenyEmoji()).then(() => {
                        const collectorRevision = messageUrteil.createReactionCollector({filter, time: 172800000, max: 2});
    
                        collectorRevision.on('collect', (reaction, user) => {
                            if(reaction.messageUrteil.partial){                              
                                reaction.messageUrteil.fetch();
                            }
                            if(reaction.partial){                              
                                reaction.fetch();
                            }
                            if(user.bot){                            
                                return;
                            }
                            if(!(reaction.messageUrteil.guild)){
                                return;
                            }
                            else if(reaction.emoji.name == IncidentManager.incidentManager.getDenyEmoji()){
                                interaction.guild.members.fetch(IncidentManager.incidentManager.getRevisionsManagerID()).then((user) => {
                                    user.send(`Es wurde eine Revision im Fall ${interaction.channel.name} eingereicht`).then(() => {
                                        tempIncidents.forEach((inc) => {
                                            if(interaction.channel.id == inc.getChannel().id){
                                                var nextName = inc.getBaseName();
                                                inc.setName(nextName + `-revision`);
                                                var channelRev = inc.getChannel();
                                                channelRev.setName(nextName + `-revision`);
                                            }
                                        })
                                    })
                                })
                            }
                        })
                    })
                })   
            })   
        } else {
            interaction.channel.send(`Die Zeitstrafe für ${driverPenalized} wurde nicht abgezogen. ` + 
                `Für Revision mit ${IncidentManager.incidentManager.getDenyEmoji()} reagieren`).then((messageUrteil) => {
                
                tempIncidents.forEach((inc) => {
                    if(interaction.channel.id == inc.getChannel().id){
                        var oldTitel = inc.getBaseName()
                        inc.setName(oldTitel + `-abgeschlossen`);
                        interaction.channel.setName(oldTitel + `-abgeschlossen`);
                    }
                })

                const filter = (reaction, user) => {
                    console.log(driverPenalized.id + '  ' + user.id)
                    return driverPenalized.id == user.id && reaction.emoji.name == IncidentManager.incidentManager.getDenyEmoji()
                }

                messageUrteil.react(IncidentManager.incidentManager.getDenyEmoji()).then(() => {
                    const collectorRevision = messageUrteil.createReactionCollector({filter, time: 172800000, max: 2});

                    collectorRevision.on('collect', (reaction, user) => {
                        if(reaction.messageUrteil.partial){
                            reaction.messageUrteil.fetch();
                        }
                        if(reaction.partial){
                            reaction.fetch();
                        }
                        if(user.bot){
                            return;
                        }
                        if(!(reaction.messageUrteil.guild)){
                            return;
                        }
                        else if(reaction.emoji.name == IncidentManager.incidentManager.getDenyEmoji()){
                            interaction.guild.members.fetch(IncidentManager.incidentManager.getRevisionsManagerID()).then((user) => {
                                console.log(user);
                                user.send(`Es wurde eine Revision im Fall ${interaction.channel.name} eingereicht`).then(() => {
                                    tempIncidents.forEach((inc) => {
                                        if(interaction.channel.id == inc.getChannel().id){
                                            var nextName = inc.getBaseName();
                                            inc.setName(nextName + `-revision`);
                                            var channelRev = inc.getChannel();
                                            channelRev.setName(nextName + `-revision`);
                                        }
                                    })
                                })
                            })
                        }
                    })
                })
                
            });
        }
    }  
}