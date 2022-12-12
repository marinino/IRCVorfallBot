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

            connection.query(`SELECT inc_id FROM incidents_testserver`, function(err, result, fields){

                if(err){
                    console.log(err);
                    return;
                }

                if(result.length == 0){
                    index = 1;
                } else {
                    var maxID = 0;
                    // Find max ID in returned array
                    result.forEach(id => {
                        if(id > maxID){
                            maxID = id;
                        }
                    })

                    index = maxID + 1;
                }
                console.log(result[0].inc_id);
            })

            league = 'liga-1';

            var baseTitel = league + '-' + index;
            

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

            var vorlage = await channel.send({ content: `Dein Vorfall wurde erstellt <@${initiator.id}>`+
                                                `\n ***Der Vorfall muss von den Stewards akzeptiert werden, oder der Vorfall kann abgelehnt werden.***`,
                                            	components: [new ActionRowBuilder().addComponents(btnAccept, btnDecline)]});

            

            var msgZeitpunkt = await channel.send({ content: `Wenn du auf den Knopf drückst öffnet sich ein Feld. ` +
                                                    `Bitte hier eintragen wann der Vorfall war. Quali, Runde 1, Runde 10,....`,
                                                    components: [new ActionRowBuilder().addComponents(time)]})

            i

            var msgBeschreibung = await channel.send({ content: `Wenn du auf den Knopf drückst öffnet sich ein Feld. ` + 
                                                    `Bitte hier eintragen was passiert ist in Form einer kurzen Beschreibung.`,
                                                    components: [new ActionRowBuilder().addComponents(desc)]})

            

            var msgLink = await channel.send({ content: `Wenn du auf den Knopf drückst öffnet sich ein Feld. `+ 
                                                    `Bitte hier eintragen den Link zum Video angeben`,
                                                    components: [new ActionRowBuilder().addComponents(link)]})

            var embedInfo = new EmbedBuilder()
                .setTitle(`Embed mit Angaben`)
                .setDescription(`Das Embed wie es später im Vorall angezeigt`)
                .setColor('#8a0339')
                .addFields(
                    [
                        {name: `Zeitpunkt:`, value: `k.A.`},
                        {name: `Beschreibung:`, value: `$k.A.`},
                        {name: `Link:`, value: `k.A.`}
                    ]
                )

            var embedInfoMessage = await channel.send({ embeds: [embedInfo]})
            
            var driversInvolvedString = '';
            driversInvolved.forEach(driver => {
                driversInvolvedString.concat()
            })

            connection.query(`INSERT INTO incidents_testserver (inc_id, basename, current_name, 
                initiator, drivers_involved, channel, msg_vorlage, msg_zeitpunkt, 
                msg_description, msg_link, embed_input_message)
                VALUES (${index}, ${baseTitel}, ${titel}, ${initiator.id}, ${driversInvolvedString}, 
                ${channel.id}, ${vorlage.id}, ${msgZeitpunkt.id}, ${msgBeschreibung.id}, 
                ${msgLink.id}, ${embedInfoMessage.id})`, function(error, result) {
                    if(error){
                        console.log(error)
                    } else {
                        console.log(result)
                    }
                    
                });

        }
    }  
}
