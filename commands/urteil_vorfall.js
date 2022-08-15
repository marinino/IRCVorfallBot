const {SlashCommandBuilder} = require('@discordjs/builders')
const IncidentManager = require('./init.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('urteil_vorfall')
        .setDescription('Hiermit wird das Urteil veröffentlicht')
        .addStringOption(option => 
            option.setName('strafpunkte')
                .setDescription('Hier muss die Anzahl an Strafpunkten kein')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('sekunden')
                .setDescription('Hier müssen die Strafpunkte rein')
                .setRequired(true))
        .addUserOption(option => 
            option.setName('verurteilter')
                .setDescription('Der gegen den die Strafe geht')
                .setRequired(false))
        .addStringOption(option => 
            option.setName('grund')
                .setDescription('Grund für die Strafe')
                .setRequired(false)),

    async execute(client, interaction, command){

        const strafpunkte = interaction.options.getString('strafpunkte')
        const sekunden = interaction.options.getString('sekunden')
        const verurteilter = interaction.options.getUser('verurteilter')
        const grund = interaction.options.getString('grund')

        interaction.reply(`Urteil wurde gestartet`);

        //CHECK VALID

        if(strafpunkte > 0 && sekunden > 0){

            if(verurteilter == null || grund == null){
                interaction.channel.send(`Grund und Verurteilten angeben!`)
                return;
            } 

            interaction.channel.send(`Für den Vorfall bekommt ${verurteilter} ${strafpunkte} Strafpunkte und ${sekunden} Sekunden Strafe ` + 
            `für ${grund}. Für Revision mit ${IncidentManager.incidentManager.getDenyEmoji()} reagieren`).then((message) => {

                var tempIncidents = new Array();
                
                if(interaction.channel.name.includes('liga-1')){
                    tempIncidents = IncidentManager.incidentManager.getIncidentsLiga1();
                } else if(interaction.channel.name.includes('liga-2')){
                    tempIncidents = IncidentManager.incidentManager.getIncidentsLiga2();
                } else if(interaction.channel.name.includes('liga-3')){
                    tempIncidents = IncidentManager.incidentManager.getIncidentsLiga3();
                }
                

                tempIncidents.forEach((inc) => {
                    if(interaction.channel.id == inc.getChannel().id){
                        var oldTitel = inc.getBaseName();
                        inc.setName(oldTitel + `-abgeschlossen`);
                        interaction.channel.setName(oldTitel + `-abgeschlossen`);
                    }
                })

                interaction.guild.channels.cache.get(IncidentManager.incidentManager.getStrafenChannelLiga1()).send(`${verurteilter} bekommt ` + 
                `${strafpunkte} Strafpunkte und ${sekunden} Sekunden Strafe für ${grund}`).then(() => {
                    message.react(IncidentManager.incidentManager.getDenyEmoji()).then(() => {
                        const collectorRevision = message.createReactionCollector({time: 172800000, max: 2});
    
                        collectorRevision.on('collect', (reaction, user) => {
                            if(reaction.message.partial){                              
                                reaction.message.fetch();
                            }
                            if(reaction.partial){                              
                                reaction.fetch();
                            }
                            if(user.bot){                            
                                return;
                            }
                            if(!(reaction.message.guild)){
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
        }
        
        if(strafpunkte > 0 && sekunden == 0){

            if(verurteilter == null || grund == null){
                interaction.channel.send(`Grund und Verurteilten angeben!`)
                return;
            } 

            interaction.channel.send(`Für den Vorfall bekommt ${verurteilter} ${strafpunkte} Strafpunkte ` + 
            `für ${grund}.`).then((message) => {
                    
                var tempIncidents = new Array();
                
                if(interaction.channel.name.includes('liga-1')){
                    tempIncidents = IncidentManager.incidentManager.getIncidentsLiga1();
                } else if(interaction.channel.name.includes('liga-2')){
                    tempIncidents = IncidentManager.incidentManager.getIncidentsLiga2();
                } else if(interaction.channel.name.includes('liga-3')){
                    tempIncidents = IncidentManager.incidentManager.getIncidentsLiga3();
                }

                tempIncidents.forEach((inc) => {
                    if(interaction.channel.id == inc.getChannel().id){
                        var oldTitel = inc.getBaseName()
                        inc.setName(oldTitel + `-abgeschlossen`);
                        interaction.channel.setName(oldTitel + `-abgeschlossen`);
                    }
                })

                interaction.guild.channels.cache.get(IncidentManager.incidentManager.getStrafenChannelLiga1()).send(`${verurteilter} bekommt ` + 
                `${strafpunkte} Strafpunkte für ${grund}`).then(() => {
                    message.react(IncidentManager.incidentManager.getDenyEmoji()).then(() => {
                        const collectorRevision = message.createReactionCollector({time: 172800000, max: 2});
    
                        collectorRevision.on('collect', (reaction, user) => {
                            if(reaction.message.partial){
                                reaction.message.fetch();
                            }
                            if(reaction.partial){
                                reaction.fetch();
                            }
                            if(user.bot){
                                return;
                            }
                            if(!(reaction.message.guild)){
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
                })
            });
        }

        if(strafpunkte == 0 && sekunden > 0){

            if(verurteilter == null || grund == null){
                interaction.channel.send(`Grund und Verurteilten angeben!`)
                return;
            } 

            interaction.channel.send(`Für den Vorfall bekommt ${verurteilter} ${sekunden} Sekunden ` + 
            `für ${grund}.`).then((message) => {

                var tempIncidents = new Array();
                
                if(interaction.channel.name.includes('liga-1')){
                    tempIncidents = IncidentManager.incidentManager.getIncidentsLiga1();
                } else if(interaction.channel.name.includes('liga-2')){
                    tempIncidents = IncidentManager.incidentManager.getIncidentsLiga2();
                } else if(interaction.channel.name.includes('liga-3')){
                    tempIncidents = IncidentManager.incidentManager.getIncidentsLiga3();
                }

                tempIncidents.forEach((inc) => {
                    if(interaction.channel.id == inc.getChannel().id){
                        var oldTitel = inc.getBaseName()
                        inc.setName(oldTitel + `-abgeschlossen`);
                        interaction.channel.setName(oldTitel + `-abgeschlossen`);
                    }
                })

                interaction.guild.channels.cache.get(IncidentManager.incidentManager.getStrafenChannelLiga1()).send(`${verurteilter} bekommt ` + 
                `${sekunden} Sekunden Strafe für ${grund}`).then(() => {
                    message.react(IncidentManager.incidentManager.getDenyEmoji()).then(() => {
                        const collectorRevision = message.createReactionCollector({time: 172800000, max: 2});
    
                        collectorRevision.on('collect', (reaction, user) => {
                            if(reaction.message.partial){
                                reaction.message.fetch();
                            }
                            if(reaction.partial){
                                reaction.fetch();
                            }
                            if(user.bot){
                                return;
                            }
                            if(!(reaction.message.guild)){
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
        }

        if(strafpunkte == 0 && sekunden == 0){
            interaction.channel.send(`Der Vorfall Rennunfall gewertet.`).then((message) => {

                var tempIncidents = new Array();
                
                if(interaction.channel.name.includes('liga-1')){
                    tempIncidents = IncidentManager.incidentManager.getIncidentsLiga1();
                } else if(interaction.channel.name.includes('liga-2')){
                    tempIncidents = IncidentManager.incidentManager.getIncidentsLiga2();
                } else if(interaction.channel.name.includes('liga-3')){
                    tempIncidents = IncidentManager.incidentManager.getIncidentsLiga3();
                }

                tempIncidents.forEach((inc) => {
                    if(interaction.channel.id == inc.getChannel().id){
                        var oldTitel = inc.getBaseName()
                        inc.setName(oldTitel + `-abgeschlossen`);
                        interaction.channel.setName(oldTitel + `-abgeschlossen`);
                    }
                })

                message.react(IncidentManager.incidentManager.getDenyEmoji()).then(() => {
                    const collectorRevision = message.createReactionCollector({time: 172800000, max: 2});

                    collectorRevision.on('collect', (reaction, user) => {
                        if(reaction.message.partial){
                            reaction.message.fetch();
                        }
                        if(reaction.partial){
                            reaction.fetch();
                        }
                        if(user.bot){
                            return;
                        }
                        if(!(reaction.message.guild)){
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
        }
    }  
}