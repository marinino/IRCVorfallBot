const {SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder} = require('discord.js')
const IncidentManager = require('./init.js');

const btnRevision = new ButtonBuilder()
    .setLabel('Revision einlegen')
    .setCustomId('btnRevision')
    .setStyle(ButtonStyle.Danger)

module.exports = {
    data: new SlashCommandBuilder()
        .setName('urteil_vorfall')
        .setDescription('Hiermit wird das Urteil veröffentlicht')
        .addIntegerOption(option => 
            option.setName('strafpunkte')
                .setDescription('Hier muss die Anzahl an Strafpunkten kein')
                .setRequired(true))
        .addIntegerOption(option => 
            option.setName('sekunden')
                .setDescription('Hier müssen die Strafpunkte rein')
                .setRequired(true))
        .addBooleanOption(option => 
            option.setName('verwarnung')
                .setDescription('True bedeutet es gibt eine Verwarnung')
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

        const strafpunkte = interaction.options.getInteger('strafpunkte')
        const sekunden = interaction.options.getInteger('sekunden')
        const verwarnung = interaction.options.getBoolean('verwarnung')
        const verurteilter = interaction.options.getUser('verurteilter')
        const grund = interaction.options.getString('grund')

        interaction.reply(`Urteil wurde gestartet`);

        //CHECK VALID

        if(strafpunkte > 0 && sekunden > 0 && !verwarnung){

            if(verurteilter == null || grund == null){
                interaction.channel.send(`Grund und Verurteilten angeben!`)
                return;
            } 

            var tempIncidents = new Array();
            var strafeChannelID = null;
            
            if(interaction.channel.name.includes('liga-1')){
                tempIncidents = IncidentManager.incidentManager.getIncidentsLiga1();
                strafeChannelID = IncidentManager.incidentManager.getStrafenChannelLiga1();
            } else if(interaction.channel.name.includes('liga-2')){
                tempIncidents = IncidentManager.incidentManager.getIncidentsLiga2();
                strafeChannelID = IncidentManager.incidentManager.getStrafenChannelLiga2();
            } else if(interaction.channel.name.includes('liga-3')){
                tempIncidents = IncidentManager.incidentManager.getIncidentsLiga3();
                strafeChannelID = IncidentManager.incidentManager.getStrafenChannelLiga3();
            } 

            tempIncidents.forEach(async (inc) => {
                console.log(interaction.channel.id)
                console.log(inc.getChannel().id)
                if(interaction.channel.id == inc.getChannel().id){
                    var oldTitel = inc.getBaseName();
                    inc.setName(oldTitel + `-abgeschlossen`);
                    await interaction.channel.setName(oldTitel + `-abgeschlossen`);
                    console.log(await interaction.channel.name)
                }
            })

            await interaction.channel.send({content: `Für den Vorfall bekommt ${verurteilter} ${strafpunkte} Strafpunkte und ${sekunden} Sekunden Strafe ` + 
                                        `für ${grund}. Unten auf dem Knopf könnt ihr eine ` + 
                                        ` Revision einreichen, dabei kann es zu einer Änderung im Strafmaß kommen. ` +
                                        `**ABER ACHTUNG, JEDER FAHRER HAT NUR 2 REVISIONEN PRO SAISON**, also nur reagieren, wenn ihr euch sicher seid.`, components: [new ActionRowBuilder().addComponents(btnRevision)]})
                   
            await interaction.guild.channels.cache.get(IncidentManager.incidentManager.getStrafenChannelLiga1()).send(`${verurteilter} bekommt ` + 
                `${strafpunkte} Strafpunkte und ${sekunden} Sekunden Strafe für ${grund}`)
                
        } else if(strafpunkte > 0 && sekunden == 0 && !verwarnung){

            if(verurteilter == null || grund == null){
                interaction.channel.send(`Grund und Verurteilten angeben!`)
                return;
            } 

            interaction.channel.send(`Für den Vorfall bekommt ${verurteilter} ${strafpunkte} Strafpunkte ` + 
            `für ${grund}.`).then((message) => {
                    

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
        } else if(strafpunkte == 0 && sekunden > 0 && !verwarnung){

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
        } else if(strafpunkte == 0 && sekunden == 0 && !verwarnung){
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
        } else if(strafpunkte > 0 && sekunden > 0 && verwarnung){

            if(verurteilter == null || grund == null){
                interaction.channel.send(`Grund und Verurteilten angeben!`)
                return;
            } 

            interaction.channel.send(`Für den Vorfall bekommt ${verurteilter} ${strafpunkte} Strafpunkte und ${sekunden} Sekunden Strafe ` + 
            `und zusätzlich eine Verwarnung für ${grund}. Für Revision mit ${IncidentManager.incidentManager.getDenyEmoji()} reagieren`)
            .then((message) => {

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
                `${strafpunkte} Strafpunkte und ${sekunden} Sekunden Strafe und zusätzlich eine Verwarnung für ${grund}`).then(() => {
                    message.react(IncidentManager.incidentManager.getDenyEmoji()).then(() => {
                        const collectorRevision = message.createReactionCollector({time: 172800000});
    
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
        } else if(strafpunkte > 0 && sekunden == 0 && verwarnung){

            if(verurteilter == null || grund == null){
                interaction.channel.send(`Grund und Verurteilten angeben!`)
                return;
            } 

            interaction.channel.send(`Für den Vorfall bekommt ${verurteilter} ${strafpunkte} Strafpunkte ` + 
            `und zusätzlich eine Verwarnung für ${grund}. Für Revision mit ${IncidentManager.incidentManager.getDenyEmoji()} reagieren`)
            .then((message) => {

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
                `${strafpunkte} Strafpunkte und zusätzlich eine Verwarnung für ${grund}`).then(() => {
                    message.react(IncidentManager.incidentManager.getDenyEmoji()).then(() => {
                        const collectorRevision = message.createReactionCollector({time: 172800000});
    
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
        } else if(strafpunkte == 0 && sekunden > 0 && verwarnung){

            if(verurteilter == null || grund == null){
                interaction.channel.send(`Grund und Verurteilten angeben!`)
                return;
            } 

            interaction.channel.send(`Für den Vorfall bekommt ${verurteilter} ${sekunden} Sekunden Strafe ` + 
            `und zusätzlich eine Verwarnung für ${grund}. Für Revision mit ${IncidentManager.incidentManager.getDenyEmoji()} reagieren`)
            .then((message) => {

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
                `${sekunden} Strafe und zusätzlich eine Verwarnung für ${grund}`).then(() => {
                    message.react(IncidentManager.incidentManager.getDenyEmoji()).then(() => {
                        const collectorRevision = message.createReactionCollector({time: 172800000});
    
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
        } else if(strafpunkte == 0 && sekunden == 0 && verwarnung){

            if(verurteilter == null || grund == null){
                interaction.channel.send(`Grund und Verurteilten angeben!`)
                return;
            } 

            interaction.channel.send(`Für den Vorfall bekommt ${verurteilter}  ` + 
            `eine Verwarnung für ${grund}. Für Revision mit ${IncidentManager.incidentManager.getDenyEmoji()} reagieren`)
            .then((message) => {

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
                `eine Verwarnung für ${grund}`).then(() => {
                    message.react(IncidentManager.incidentManager.getDenyEmoji()).then(() => {
                        const collectorRevision = message.createReactionCollector({time: 172800000});
    
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
    }  
}