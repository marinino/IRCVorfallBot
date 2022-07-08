const {SlashCommandBuilder} = require('@discordjs/builders')
const {MessageEmbed} = require('discord.js');
const IncidentManager = require('./init.js');
const Incident = require('../dataClasses/Incident.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('erstellevorfall')
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

            league = 'liga-1';
            index = IncidentManager.incidentManager.getIncidentsLiga1().length + 1;
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
            incident.setID(IncidentManager.incidentManager.getCurrentIDLiga1())

            await channel.send(`Wann ist der Vorfall passiert? (Qualyfing, Runde 10, Runde 15,...) + Videolink + Beschreibung`)

            const filter = (messageDesc) => {
                console.log(messageDesc.author.id + '  ' + initiator.id)
                return messageDesc.author.id == initiator.id
            }

            const collectorIncident = channel.createMessageCollector({filter, time: 300000})

            collectorIncident.on('collect', messageDesc => {
                var desc = messageDesc.content;
                incident.setDescription(desc)

                channel.send(`Steward muss Vorfall akzeptieren. Mit ${IncidentManager.incidentManager.getAcceptEmoji()} reagieren ` +
                                                    `um zu akzeptieren, mit ${IncidentManager.incidentManager.getDenyEmoji()} reagieren um den ` + 
                                                    `Vorfall abzuweisen`).then((confirmMessage) => {

                    confirmMessage.react(IncidentManager.incidentManager.getAcceptEmoji());
                    confirmMessage.react(IncidentManager.incidentManager.getDenyEmoji());

                    const collectorConfirm = confirmMessage.createReactionCollector({max: 3});

                    collectorConfirm.on('collect', (reaction, user) => {

                        interaction.guild.members.fetch(user.id).then((userForRole) => {

                            if(reaction.message.partial){
                                console.log('HUUUUUUUUUUUUUUUUUU')
                                reaction.message.fetch();
                            }
                            if(reaction.partial){
                                console.log('HUUUUUUUUUUUUUUUUUU')
                                reaction.fetch();
                            }
                            if(user.bot){
                                console.log('HUUUUUUUUUUUUUUUUUU')
                                return;
                            }
                            if(!(reaction.message.guild)){
                                console.log('HUUUUUUUUUUUUUUUUUU')
                                return;
                            }
                            if(reaction.emoji.name == IncidentManager.incidentManager.getAcceptEmoji() && 
                                userForRole.roles.cache.has(IncidentManager.incidentManager.getStewardRolle())){

                                driversInvolved.forEach((driver) => {
                                    reaction.message.channel.permissionOverwrites.edit(driver.id, { SEND_MESSAGES: true })
                                })

                                var newTitel = incident.getBaseName();
                                channel.setName(newTitel)
                                incident.setName(newTitel)
                                console.log('HUUUUUUUUUUUUUUUUUU')
                                channel.bulkDelete(100);

                                const incidentFormEmbed = new MessageEmbed()
                                    .setColor('#ff8c00')
                                    .setTitle(`Vorfall ${incident.getName()}`)
                                    .setDescription('Alle Infos zum Vorfall')
                                    .addFields(
                                        { name: 'Beschreibung', value: `${incident.getDescription()}` },
                                    )

                                channel.send({ embeds: [incidentFormEmbed] });

                                IncidentManager.incidentManager.setCurrentIDLiga1(IncidentManager.incidentManager.getCurrentIDLiga1() + 1);

                                console.log(incident.getID())

                            } else if(reaction.emoji.name == IncidentManager.incidentManager.getDenyEmoji() && 
                                userForRole.roles.cache.has(IncidentManager.incidentManager.getStewardRolle())){

                                var newTitel = incident.getBaseName();
                                channel.setName(newTitel + '-abgewießen')
                                incident.setName(newTitel + '-abgewießen')
                                
                                console.log('HUUUUUUUUUUUUUUUUUU')
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
                                console.log(`Falsche Annahme`)
                                reaction.users.remove(user.id);
                            }
                        })
                    })  
                });                                     
            }) 
        } else if(interaction.channel.id == IncidentManager.incidentManager.getVorfallChannelLiga2()){
            league = 'liga-2';
        } else if(interaction.channel.id == IncidentManager.incidentManager.getVorfallChannelLiga3()){
            league = 'liga-3';
        }

    }  
}