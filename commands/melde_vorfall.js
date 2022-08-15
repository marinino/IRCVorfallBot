const {SlashCommandBuilder} = require('@discordjs/builders')
const {MessageEmbed} = require('discord.js');
const IncidentManager = require('./init.js');
const Incident = require('../dataClasses/Incident.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('melde_vorfall')
        .setDescription('Erstellt einen Vorfall in dem eine andere Person beschuldigt wird')
        .addUserOption(option => 
            option.setName('driverinvolved1')
                .setDescription('Beschuldigter Fahrer')
                .setRequired(true))
        .addUserOption(option => 
            option.setName('driverinvolved2')
                .setDescription('Beschuldigter Fahrer (OPTIONAL)')
                .setRequired(false))
        .addUserOption(option => 
            option.setName('driverinvolved3')
                .setDescription('Beschuldigter Fahrer (OPTIONAL)')
                .setRequired(false))
        .addUserOption(option => 
            option.setName('driverinvolved4')
                .setDescription('Beschuldigter Fahrer (OPTIONAL)')
                .setRequired(false))
        .addUserOption(option => 
            option.setName('driverinvolved5')
                .setDescription('Beschuldigter Fahrer (OPTIONAL)')
                .setRequired(false)),

    async execute(client, interaction, command){

        const driverInvolved1 = interaction.options.getUser('driverinvolved1')
        const driverInvolved2 = interaction.options.getUser('driverinvolved2')
        const driverInvolved3 = interaction.options.getUser('driverinvolved3')
        const driverInvolved4 = interaction.options.getUser('driverinvolved4')
        const driverInvolved5 = interaction.options.getUser('driverinvolved5')

        interaction.reply('Erstellung gestartet')

        var incident = new Incident();

        var league = '';
        var index = 0
        if(interaction.channel.id == IncidentManager.incidentManager.getVorfallChannelLiga1()){

            var sentMessages = 0;
            league = 'liga-1';
            index = IncidentManager.incidentManager.getCurrentIDLiga1() + 1;
            var tempIncidents = IncidentManager.incidentManager.getIncidentsLiga1();
            tempIncidents.push(incident);
            IncidentManager.incidentManager.setIncidentsLiga1(tempIncidents);

            var baseTitel = league + '-' + index;
            incident.setBaseName(baseTitel);

            var titel = baseTitel + '-noted';
            var initiator = await interaction.guild.members.fetch(interaction.user.id);
            var driversInvolved = new Array();
            driversInvolved.push(driverInvolved1);
            if(driverInvolved2 != null){
                driversInvolved.push(driverInvolved2)
            }
            if(driverInvolved3 != null){
                driversInvolved.push(driverInvolved3)
            }
            if(driverInvolved4 != null){
                driversInvolved.push(driverInvolved4)
            }
            if(driverInvolved5 != null){
                driversInvolved.push(driverInvolved5)
            }
            var channel = await interaction.guild.channels.create(titel, {
                type: 'GUILD_TEXT'
            })
            
            const categoryID = '990013809206886430';
            await channel.setParent(categoryID)
            await channel.permissionOverwrites.create(channel.guild.roles.everyone, { VIEW_CHANNEL: false }); 
            await channel.permissionOverwrites.create(interaction.user.id, { VIEW_CHANNEL: true});
            await channel.permissionOverwrites.create(IncidentManager.incidentManager.getStewardRolle(), { VIEW_CHANNEL: true, SEND_MESSAGES: true })
            driversInvolved.forEach(driver => {
                channel.permissionOverwrites.create(driver.id, { VIEW_CHANNEL: true, SEND_MESSAGES: false })
            })

            incident.setChannel(channel);
            incident.setDriversInvoled(driversInvolved);
            incident.setInitiator(initiator);
            incident.setName(titel);
            incident.setID(index)

            var vorlage = await channel.send(`Dein Vorfall wurde erstellt <@${initiator.id}> \n **Vorlage**: \n \n`+
                                            `**Quali/Runde**: 25 \n` + 
                                            `**Beschreibung**: Helmut hat mich gedreht und ich habe einen Flügelschaden bekommen und habe Plätze verloren. \n` +
                                            `**Video**: Es sind nur Youtube/Twitch Links erlaubt! (An erster Stelle im Video muss der unbearbeitete Vorfall sein. (Keine Zeitlupen, usw...)) \n ` +
                                            `\n \n ***Der Vorfall muss von den Stewards mit ${IncidentManager.incidentManager.getAcceptEmoji()} akzeptiert werden*** ` +
                                            `***, oder der Vorfall wird per ${IncidentManager.incidentManager.getDenyEmoji()} abgelehnt.***`);

            vorlage.react(IncidentManager.incidentManager.getAcceptEmoji());
            vorlage.react(IncidentManager.incidentManager.getDenyEmoji());

            const filter = (messageDesc) => {
                console.log(messageDesc.author.id + '  ' + initiator.id)
                return messageDesc.author.id == initiator.id
            }

            const collectorIncident = channel.createMessageCollector({filter, time: 300000})

            var description = ''
            incident.setDescription(description)

            collectorIncident.on('collect', messageDesc => {
                var oldDesc = incident.getDescription();
                var desc = messageDesc.content;
                var newDesc = oldDesc.concat(`${desc}\n`)
                incident.setDescription(newDesc)
                sentMessages++;
            });

           
            const collectorConfirm = vorlage.createReactionCollector();

            collectorConfirm.on('collect', (reaction, user) => {

                interaction.guild.members.fetch(user.id).then((userForRole) => {

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
                    if(reaction.emoji.name == IncidentManager.incidentManager.getAcceptEmoji() && 
                        userForRole.roles.cache.has(IncidentManager.incidentManager.getStewardRolle()) && sentMessages > 0){

                        var newTitel = incident.getBaseName();
                        channel.setName(newTitel).then(() => {
                            console.log(`Der Name der Vorfallchannels wurde auf ${newTitel} geändert`)
                            incident.setName(newTitel)
                            channel.bulkDelete(100);

                            const incidentFormEmbed = new MessageEmbed()
                                .setColor('#ff8c00')
                                .setTitle(`Vorfall ${incident.getName()}`)
                                .setDescription('Alle Infos zum Vorfall')
                                .addFields(
                                    { name: 'Beschreibung', value: `${incident.getDescription()}` },
                                )

                            channel.send({ embeds: [incidentFormEmbed] }).then(() => {
                                var stringIDS = '';
                                driversInvolved.forEach((driver) => {
                                    stringIDS = stringIDS.concat(`<@${driver.id}> `)
                                })
                                channel.send(`Ab jetzt kann sich jeder zu dem Vorfall äußern. ${stringIDS}am besten mit Video`).then(() => {
                                    driversInvolved.forEach((driver) => {
                                        reaction.message.channel.permissionOverwrites.edit(driver.id, { SEND_MESSAGES: true })
                                    })
                                })
                            });

                            IncidentManager.incidentManager.setCurrentIDLiga1(index);
                            
                        })
                    } else if(reaction.emoji.name == IncidentManager.incidentManager.getDenyEmoji() && 
                        userForRole.roles.cache.has(IncidentManager.incidentManager.getStewardRolle()) && sentMessages > 0){

                        var newTitel = incident.getBaseName();
                        channel.setName(newTitel + '-abgewießen')
                        incident.setName(newTitel + '-abgewießen')
                        
                        channel.send('Der Vorfall wurde abgewiesen');
                        tempIncidents = IncidentManager.incidentManager.getIncidentsLiga1();
                        tempIncidents.forEach((inc) => {
                            if(inc.getChannel() == channel){
                                tempIncidents.splice(tempIncidents.indexOf(inc), 1);
                            }
                        })
                        IncidentManager.incidentManager.setIncidentsLiga1(tempIncidents);
                        confirmMessage.delete();

                        interaction.user.send('Dein Vorfall wurde abgelehnt');
                    } else {
                        console.log(`Falsche Annahme oder keine Nachricht geschrieben`)
                        reaction.users.remove(user.id);
                    }
                })
            })  
                                                    
            
        } else if(interaction.channel.id == IncidentManager.incidentManager.getVorfallChannelLiga2()){

            var sentMessages = 0;
            league = 'liga-2';
            index = IncidentManager.incidentManager.getIncidentsLiga2().length + 1;
            var tempIncidents = IncidentManager.incidentManager.getIncidentsLiga2();
            tempIncidents.push(incident);
            IncidentManager.incidentManager.setIncidentsLiga2(tempIncidents);

            var baseTitel = league + '-' + index;
            incident.setBaseName(baseTitel);

            var titel = baseTitel + '-noted';
            var initiator = await interaction.guild.members.fetch(interaction.user.id);
            var driversInvolved = new Array();
            driversInvolved.push(driverInvolved1);
            if(driverInvolved2 != null){
                driversInvolved.push(driverInvolved2)
            }
            if(driverInvolved3 != null){
                driversInvolved.push(driverInvolved3)
            }
            if(driverInvolved4 != null){
                driversInvolved.push(driverInvolved4)
            }
            if(driverInvolved5 != null){
                driversInvolved.push(driverInvolved5)
            }
            var channel = await interaction.guild.channels.create(titel, {
                type: 'GUILD_TEXT'
            })
            
            const categoryID = '990013809206886430';
            await channel.setParent(categoryID)
            await channel.permissionOverwrites.create(channel.guild.roles.everyone, { VIEW_CHANNEL: false }); 
            await channel.permissionOverwrites.create(interaction.user.id, { VIEW_CHANNEL: true});
            await channel.permissionOverwrites.create(IncidentManager.incidentManager.getStewardRolle(), { VIEW_CHANNEL: true, SEND_MESSAGES: true })
            driversInvolved.forEach(driver => {
                channel.permissionOverwrites.create(driver.id, { VIEW_CHANNEL: true, SEND_MESSAGES: false })
            })

            incident.setChannel(channel);
            incident.setDriversInvoled(driversInvolved);
            incident.setInitiator(initiator);
            incident.setName(titel);
            incident.setID(IncidentManager.incidentManager.getCurrentIDLiga2())

            var vorlage = await channel.send(`**Vorlage**: \n \n`+
                                `**Quali/Runde**: 25 \n` + 
                                `**Beschreibung**: Helmut hat mich gedreht und ich habe einen Flügelschaden bekommen und habe Plätze verloren. \n` +
                                `**Video**: Es sind nur Youtube/Twitch Links erlaubt! (An erster Stelle im Video muss der unbearbeitete Vorfall sein. (Keine Zeitlupen, usw...)) \n `);

            vorlage.react(IncidentManager.incidentManager.getAcceptEmoji());
            vorlage.react(IncidentManager.incidentManager.getDenyEmoji());

            const filter = (messageDesc) => {
                console.log(messageDesc.author.id + '  ' + initiator.id)
                return messageDesc.author.id == initiator.id
            }

            const collectorIncident = channel.createMessageCollector({filter, time: 300000})

            var description = ''
            incident.setDescription(description)

            collectorIncident.on('collect', messageDesc => {
                var oldDesc = incident.getDescription();
                var desc = messageDesc.content;
                var newDesc = oldDesc.concat(`${desc}\n`)
                incident.setDescription(newDesc)
                sentMessages++;
            });

           
            const collectorConfirm = vorlage.createReactionCollector();

            collectorConfirm.on('collect', (reaction, user) => {

                interaction.guild.members.fetch(user.id).then((userForRole) => {

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
                    if(reaction.emoji.name == IncidentManager.incidentManager.getAcceptEmoji() && 
                        userForRole.roles.cache.has(IncidentManager.incidentManager.getStewardRolle()) && sentMessages > 0){

                        var newTitel = incident.getBaseName();
                        channel.setName(newTitel).then(() => {
                            console.log(`Der Name der Vorfallchannels wurde auf ${newTitel} geändert`)
                            incident.setName(newTitel)
                            channel.bulkDelete(100);

                            const incidentFormEmbed = new MessageEmbed()
                                .setColor('#ff8c00')
                                .setTitle(`Vorfall ${incident.getName()}`)
                                .setDescription('Alle Infos zum Vorfall')
                                .addFields(
                                    { name: 'Beschreibung', value: `${incident.getDescription()}` },
                                )

                            channel.send({ embeds: [incidentFormEmbed] }).then(() => {
                                driversInvolved.forEach((driver) => {
                                    reaction.message.channel.permissionOverwrites.edit(driver.id, { SEND_MESSAGES: true })
                                })
                            });

                            IncidentManager.incidentManager.setCurrentIDLiga2(IncidentManager.incidentManager.getCurrentIDLiga2() + 1);
                            
                        })
                    } else if(reaction.emoji.name == IncidentManager.incidentManager.getDenyEmoji() && 
                        userForRole.roles.cache.has(IncidentManager.incidentManager.getStewardRolle()) && sentMessages > 0){

                        var newTitel = incident.getBaseName();
                        channel.setName(newTitel + '-abgewießen')
                        incident.setName(newTitel + '-abgewießen')
                        
                        channel.send('Der Vorfall wurde abgewiesen');
                        tempIncidents = IncidentManager.incidentManager.getIncidentsLiga2();
                        tempIncidents.forEach((inc) => {
                            if(inc.getChannel() == channel){
                                tempIncidents.splice(tempIncidents.indexOf(inc), 1);
                            }
                        })
                        IncidentManager.incidentManager.setIncidentsLiga2(tempIncidents);
                        confirmMessage.delete();

                        interaction.user.send('Dein Vorfall wurde abgelehnt');
                    } else {
                        console.log(`Falsche Annahme oder keine Nachricht geschickt`)
                        reaction.users.remove(user.id);
                    }
                })
            })  
        } else if(interaction.channel.id == IncidentManager.incidentManager.getVorfallChannelLiga3()){

            var sentMessages = 0;
            league = 'liga-3';
            index = IncidentManager.incidentManager.getIncidentsLiga3().length + 1;
            var tempIncidents = IncidentManager.incidentManager.getIncidentsLiga3();
            tempIncidents.push(incident);
            IncidentManager.incidentManager.setIncidentsLiga3(tempIncidents);

            var baseTitel = league + '-' + index;
            incident.setBaseName(baseTitel);

            var titel = baseTitel + '-noted';
            var initiator = await interaction.guild.members.fetch(interaction.user.id);
            var driversInvolved = new Array();
            driversInvolved.push(driverInvolved1);
            if(driverInvolved2 != null){
                driversInvolved.push(driverInvolved2)
            }
            if(driverInvolved3 != null){
                driversInvolved.push(driverInvolved3)
            }
            if(driverInvolved4 != null){
                driversInvolved.push(driverInvolved4)
            }
            if(driverInvolved5 != null){
                driversInvolved.push(driverInvolved5)
            }
            var channel = await interaction.guild.channels.create(titel, {
                type: 'GUILD_TEXT'
            })
            
            const categoryID = '990013809206886430';
            await channel.setParent(categoryID)
            await channel.permissionOverwrites.create(channel.guild.roles.everyone, { VIEW_CHANNEL: false }); 
            await channel.permissionOverwrites.create(interaction.user.id, { VIEW_CHANNEL: true});
            await channel.permissionOverwrites.create(IncidentManager.incidentManager.getStewardRolle(), { VIEW_CHANNEL: true, SEND_MESSAGES: true })
            driversInvolved.forEach(driver => {
                channel.permissionOverwrites.create(driver.id, { VIEW_CHANNEL: true, SEND_MESSAGES: false })
            })

            incident.setChannel(channel);
            incident.setDriversInvoled(driversInvolved);
            incident.setInitiator(initiator);
            incident.setName(titel);
            incident.setID(IncidentManager.incidentManager.getCurrentIDLiga3())

            var vorlage = await channel.send(`**Vorlage**: \n \n`+
                                `**Quali/Runde**: 25 \n` + 
                                `**Beschreibung**: Helmut hat mich gedreht und ich habe einen Flügelschaden bekommen und habe Plätze verloren. \n` +
                                `**Video**: Es sind nur Youtube/Twitch Links erlaubt! (An erster Stelle im Video muss der unbearbeitete Vorfall sein. (Keine Zeitlupen, usw...)) \n `);

            vorlage.react(IncidentManager.incidentManager.getAcceptEmoji());
            vorlage.react(IncidentManager.incidentManager.getDenyEmoji());

            const filter = (messageDesc) => {
                console.log(messageDesc.author.id + '  ' + initiator.id)
                return messageDesc.author.id == initiator.id
            }

            const collectorIncident = channel.createMessageCollector({filter, time: 300000})

            var description = ''
            incident.setDescription(description)

            collectorIncident.on('collect', messageDesc => {
                var oldDesc = incident.getDescription();
                var desc = messageDesc.content;
                var newDesc = oldDesc.concat(`${desc}\n`)
                incident.setDescription(newDesc)
                sentMessages++;
            });

           
            const collectorConfirm = vorlage.createReactionCollector();

            collectorConfirm.on('collect', (reaction, user) => {

                interaction.guild.members.fetch(user.id).then((userForRole) => {

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
                    if(reaction.emoji.name == IncidentManager.incidentManager.getAcceptEmoji() && 
                        userForRole.roles.cache.has(IncidentManager.incidentManager.getStewardRolle()) && sentMessages > 0){

                        var newTitel = incident.getBaseName();
                        channel.setName(newTitel).then(() => {
                            console.log(`Der Name der Vorfallchannels wurde auf ${newTitel} geändert`)
                            incident.setName(newTitel)
                            channel.bulkDelete(100);

                            const incidentFormEmbed = new MessageEmbed()
                                .setColor('#ff8c00')
                                .setTitle(`Vorfall ${incident.getName()}`)
                                .setDescription('Alle Infos zum Vorfall')
                                .addFields(
                                    { name: 'Beschreibung', value: `${incident.getDescription()}` },
                                )

                            channel.send({ embeds: [incidentFormEmbed] }).then(() => {
                                driversInvolved.forEach((driver) => {
                                    reaction.message.channel.permissionOverwrites.edit(driver.id, { SEND_MESSAGES: true })
                                })
                            });

                            IncidentManager.incidentManager.setCurrentIDLiga3(IncidentManager.incidentManager.getCurrentIDLiga3() + 1);
                            
                        })
                    } else if(reaction.emoji.name == IncidentManager.incidentManager.getDenyEmoji() && 
                        userForRole.roles.cache.has(IncidentManager.incidentManager.getStewardRolle()) && sentMessages > 0){

                        var newTitel = incident.getBaseName();
                        channel.setName(newTitel + '-abgewießen')
                        incident.setName(newTitel + '-abgewießen')
                        
                        channel.send('Der Vorfall wurde abgewiesen');
                        tempIncidents = IncidentManager.incidentManager.getIncidentsLiga3();
                        tempIncidents.forEach((inc) => {
                            if(inc.getChannel() == channel){
                                tempIncidents.splice(tempIncidents.indexOf(inc), 1);
                            }
                        })
                        IncidentManager.incidentManager.setIncidentsLiga3(tempIncidents);
                        confirmMessage.delete();

                        interaction.user.send('Dein Vorfall wurde abgelehnt');
                    } else {
                        console.log(`Falsche Annahme oder keine Nachricht geschickt`)
                        reaction.users.remove(user.id);
                    }
                })
            })  
        }
    }  
}