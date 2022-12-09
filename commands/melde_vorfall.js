const {EmbedBuilder, SlashCommandBuilder, PermissionsBitField, ActionRowBuilder, TextInputBuilder, TextInputStyle, ButtonBuilder, ButtonStyle, ModalBuilder, InteractionType} = require('discord.js');

const IncidentManager = require('./init.js');
const Incident = require('../dataClasses/Incident.js');

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

    async execute(client, interaction, command, connection){

        connection.ping((err) => {
            if(err){
                console.log(err)
            } else {
                console.log('Looks fine')
            }
            
        })

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
            IncidentManager.incidentManager.setCurrentIDLiga1(index);

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
            
            const categoryID = '990013809206886430';
            await channel.setParent(categoryID)
            await channel.permissionOverwrites.create(IncidentManager.incidentManager.getStewardRolle(), {ViewChannel: true, SendMessages:true})
            await channel.permissionOverwrites.create(interaction.user.id, {ViewChannel: true, SendMessages: true})
            driversInvolved.forEach(async driver => {
                await channel.permissionOverwrites.create(driver.id, { ViewChannel: true, SendMessages: false })
            })

            incident.setChannel(channel);
            incident.setDriversInvoled(driversInvolved);
            incident.setInitiator(initiator);
            incident.setName(titel);
            incident.setID(index)

            var tempIncidents = IncidentManager.incidentManager.getIncidentsLiga1();
            tempIncidents.push(incident);

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
        }
    }  
}
