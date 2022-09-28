const {EmbedBuilder, SlashCommandBuilder, PermissionsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require('discord.js');

const time = new ButtonBuilder()
    .setLabel('Zeitpunkt des Vorfalls eingeben')
    .setCustomId('btnTime')
    .setStyle(ButtonStyle.Primary)
                
const desc = new ButtonBuilder()
    .setLabel('Beschreibung zum Vorfall eingeben')
    .setCustomId('btnDesc')
    .setStyle(ButtonStyle.Primary)
    
const link = new ButtonBuilder()
    .setLabel('Link zum Video des Vorfalls eingeben')
    .setCustomId('btnLink')
    .setStyle(ButtonStyle.Primary)
    
const btnAccept = new ButtonBuilder()
    .setLabel('Vorfall akzeptieren')
    .setCustomId('btnAcceptInc')
    .setStyle(ButtonStyle.Success)

const btnDecline = new ButtonBuilder()
    .setLabel('Vorfall ablehnen')
    .setCustomId('btnDeclineInc')
    .setStyle(ButtonStyle.Danger)

const IncidentManager = require('./init.js');
const Incident = require('../dataClasses/Incident.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('melde_zeitstrafe')
        .setDescription('Erstellt einen Vorfall in dem eine Zeitstrafe abgeuogen werden soll'),

    async execute(client, interaction, command){

        interaction.reply('Erstellung gestartet')

        var incident = new Incident();

        var league = '';
        var index = 0
        if(interaction.channel.id == IncidentManager.incidentManager.getVorfallChannelLiga1()){

            var sentMessages = 0;
            league = 'liga-1-sec';
            index = IncidentManager.incidentManager.getIncidentsLiga1().length + 1;
            IncidentManager.incidentManager.setCurrentIDLiga1(index);
            var tempIncidents = IncidentManager.incidentManager.getIncidentsLiga1();
            tempIncidents.push(incident);
            IncidentManager.incidentManager.setIncidentsLiga1(tempIncidents);

            var baseTitel = league + '-' + index;
            incident.setBaseName(baseTitel);

            var titel = baseTitel + '-noted';
            var initiator = await interaction.guild.members.fetch(interaction.user.id);
            var driversInvolved = new Array();
            var channel = await interaction.guild.channels.create({
                name: titel,
                permissionOverwrites: [
                    {
                        id: interaction.guild.roles.everyone,
                        deny: [PermissionsBitField.Flags.ViewChannel],
                    }
                ],
                type: 0
            });
            
           const tikTokMensch = await interaction.guild.members.fetch(IncidentManager.incidentManager.getTikTokMenschID())

            const categoryID = '990013809206886430';
            await channel.setParent(categoryID)
            await channel.permissionOverwrites.create(IncidentManager.incidentManager.getStewardRolle(), {ViewChannel: true, SendMessages:true})
            await channel.permissionOverwrites.create(tikTokMensch.id, {ViewChannel: true, SendMessages:true})
            await channel.permissionOverwrites.create(interaction.user.id, {ViewChannel: true, SendMessages: true})
            driversInvolved.forEach(driver => {
                channel.permissionOverwrites.create(driver.id, { ViewChannel: true, SendMessages: false })
            })

            incident.setChannel(channel);
            incident.setDriversInvoled(driversInvolved);
            incident.setInitiator(initiator);
            incident.setName(titel);
            incident.setID(index)

            var vorlage = await channel.send({ content: `Dein Vorfall wurde erstellt <@${initiator.id}>`+
                                                `\n ***Der Vorfall muss von den Stewards akzeptiert werden, oder der Vorfall kann abgelehnt werden.***`,
                                            	components: [new ActionRowBuilder().addComponents(btnAccept, btnDecline)]});

            incident.setMsgVorlage(vorlage);

            var msgZeitpunkt = await channel.send({ content: `Wenn du auf den Knopf drückst öffnet sich ein Feld. ` +
                                                    `Bitte hier eintragen wann der Vorfall war. Quali, Runde 1, Runde 10,....`,
                                                    components: [new ActionRowBuilder().addComponents(time)]})

            incident.setMsgZeitpunkt(msgZeitpunkt)

            var msgBeschreibung = await channel.send({ content: `Wenn du auf den Knopf drückst öffnet sich ein Feld. ` + 
                                                    `Bitte hier eintragen was passiert ist in Form einer kurzen Beschreibung.`,
                                                    components: [new ActionRowBuilder().addComponents(desc)]})

            incident.setMsgBeschreibung(msgBeschreibung);

            var msgLink = await channel.send({ content: `Wenn du auf den Knopf drückst öffnet sich ein Feld. `+ 
                                                    `Bitte hier eintragen den Link zum Video angeben`,
                                                    components: [new ActionRowBuilder().addComponents(link)]})

            incident.setMsgLink(msgLink);

            var embedInfo = new EmbedBuilder()
                .setTitle(`Embed mit Angaben`)
                .setDescription(`Das Embed wie es später im Vorall angezeigt`)
                .setColor('#8a0339')
                .addFields(
                    [
                        {name: `Zeitpunkt:`, value: `${incident.getZeitpunkt()}`},
                        {name: `Beschreibung:`, value: `${incident.getDescription()}`},
                        {name: `Link:`, value: `${incident.getLink()}`}
                    ]
                )

            var embedInfoMessage = await channel.send({ embeds: [embedInfo]})
            incident.setEmbedInputMessage(embedInfoMessage);

                                                  
        } else if(interaction.channel.id == IncidentManager.incidentManager.getVorfallChannelLiga2()){

            var sentMessages = 0;
            league = 'liga-2-sec';
            index = IncidentManager.incidentManager.getCurrentIDLiga2().length + 1;
            IncidentManager.incidentManager.setCurrentIDLiga2(index);
            var tempIncidents = IncidentManager.incidentManager.getIncidentsLiga2();
            tempIncidents.push(incident);
            IncidentManager.incidentManager.setIncidentsLiga2(tempIncidents);

            var baseTitel = league + '-' + index;
            incident.setBaseName(baseTitel);

            var titel = baseTitel + '-noted';
            var initiator = await interaction.guild.members.fetch(interaction.user.id);
            var driversInvolved = new Array();
            var channel = await interaction.guild.channels.create(titel, {
                type: 'GUILD_TEXT'
            })
            
            const categoryID = '990013809206886430';
            await channel.setParent(categoryID)
            await channel.permissionOverwrites.create(channel.guild.roles.everyone, { VIEW_CHANNEL: false }); 
            await channel.permissionOverwrites.create(interaction.user.id, { VIEW_CHANNEL: true});
            await channel.permissionOverwrites.create(IncidentManager.incidentManager.getStewardRolle(), { VIEW_CHANNEL: true, SEND_MESSAGES: true })

            incident.setChannel(channel);
            incident.setDriversInvoled(driversInvolved);
            incident.setInitiator(initiator);
            incident.setName(titel);
            incident.setID(index)

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

                        driversInvolved.forEach((driver) => {
                            reaction.message.channel.permissionOverwrites.edit(driver.id, { SEND_MESSAGES: true })
                        })

                        var newTitel = incident.getBaseName();
                        channel.setName(newTitel)
                        incident.setName(newTitel)
                        console.log('HUUUUUUUUUUUUUUUUUU')
                        channel.bulkDelete(100);

                        const incidentFormEmbed = new EmbedBuilder()
                            .setColor('#ff8c00')   
                            .setTitle(`Vorfall ${incident.getName()}`)
                            .setDescription('Alle Infos zum Vorfall')
                            .addFields(
                                { name: 'Beschreibung', value: `Vorfall erstellt von ${initiator.id}: \n \n ${incident.getDescription()}` },
                            )

                        channel.send({ embeds: [incidentFormEmbed] });

                        

                        console.log(incident.getID())

                    } else if(reaction.emoji.name == IncidentManager.incidentManager.getDenyEmoji() && 
                        userForRole.roles.cache.has(IncidentManager.incidentManager.getStewardRolle())){

                        var newTitel = incident.getBaseName();
                        channel.setName(newTitel + '-abgewiesen')
                        incident.setName(newTitel + '-abgewiesen')
                        
                        console.log('HUUUUUUUUUUUUUUUUUU')
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
                        console.log(`Falsche Annahme oder keine Nachricht gesendet`)
                        reaction.users.remove(user.id);
                    }
                })
            }) 
        } else if(interaction.channel.id == IncidentManager.incidentManager.getVorfallChannelLiga3()){

            var sentMessages = 0;
            league = 'liga-3-sec';
            index = IncidentManager.incidentManager.getIncidentsLiga3().length + 1;
            IncidentManager.incidentManager.setCurrentIDLiga3(index);
            var tempIncidents = IncidentManager.incidentManager.getIncidentsLiga3();
            tempIncidents.push(incident);
            IncidentManager.incidentManager.setIncidentsLiga3(tempIncidents);

            var baseTitel = league + '-' + index;
            incident.setBaseName(baseTitel);

            var titel = baseTitel + '-noted';
            var initiator = await interaction.guild.members.fetch(interaction.user.id);
            var driversInvolved = new Array();
            var channel = await interaction.guild.channels.create(titel, {
                type: 'GUILD_TEXT'
            })
            
            const categoryID = '990013809206886430';
            await channel.setParent(categoryID)
            await channel.permissionOverwrites.create(channel.guild.roles.everyone, { VIEW_CHANNEL: false }); 
            await channel.permissionOverwrites.create(interaction.user.id, { VIEW_CHANNEL: true});
            await channel.permissionOverwrites.create(IncidentManager.incidentManager.getStewardRolle(), { VIEW_CHANNEL: true, SEND_MESSAGES: true })

            incident.setChannel(channel);
            incident.setDriversInvoled(driversInvolved);
            incident.setInitiator(initiator);
            incident.setName(titel);
            incident.setID(index)

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

                        driversInvolved.forEach((driver) => {
                            reaction.message.channel.permissionOverwrites.edit(driver.id, { SEND_MESSAGES: true })
                        })

                        var newTitel = incident.getBaseName();
                        channel.setName(newTitel)
                        incident.setName(newTitel)
                        console.log('HUUUUUUUUUUUUUUUUUU')
                        channel.bulkDelete(100);

                        const incidentFormEmbed = new EmbedBuilder()
                            .setColor('#ff8c00')   
                            .setTitle(`Vorfall ${incident.getName()}`)
                            .setDescription('Alle Infos zum Vorfall')
                            .addFields(
                                { name: 'Beschreibung', value: `Vorfall erstellt von ${initiator.id}: \n \n ${incident.getDescription()}` },
                            )

                        channel.send({ embeds: [incidentFormEmbed] });

                        

                        console.log(incident.getID())

                    } else if(reaction.emoji.name == IncidentManager.incidentManager.getDenyEmoji() && 
                        userForRole.roles.cache.has(IncidentManager.incidentManager.getStewardRolle())){

                        var newTitel = incident.getBaseName();
                        channel.setName(newTitel + '-abgewiesen')
                        incident.setName(newTitel + '-abgewiesen')
                        
                        console.log('HUUUUUUUUUUUUUUUUUU')
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
                        console.log(`Falsche Annahme oder keine Nachricht gesendet`)
                        reaction.users.remove(user.id);
                    }
                })
            }) 
        }

    }  
}