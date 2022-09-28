const { InteractionType, TextInputBuilder, ModalBuilder, TextInputStyle, ActionRowBuilder, EmbedBuilder } = require("discord.js");
const IncidentManager = require('../../commands/init.js');
const Incident = require('../../dataClasses/Incident.js');

const textInputTime = new TextInputBuilder()
    .setCustomId('textInputTime')
    .setLabel('Textfeld für Zeitpunkt')
    .setRequired(true)
    .setStyle(TextInputStyle.Short)

const textInputLink = new TextInputBuilder()
    .setCustomId('textInputLink')
    .setLabel('Textfeld für Link')
    .setRequired(true)
    .setStyle(TextInputStyle.Short)

const textInputDesc = new TextInputBuilder()
    .setCustomId('textInputDesc')
    .setLabel('Textfeld für Beschreibung')
    .setRequired(true)
    .setStyle(TextInputStyle.Paragraph)

var ctr = 0;

module.exports = async (client, Discord, interaction) => {

    

    console.log('Interaction create detected: ' + ctr )
    
    ctr++;
    
    if((interaction.type === InteractionType.ApplicationCommand)){
        const cmd = client.commands.get(interaction.commandName);

        if(!cmd) return;
    
        try {
            console.log(cmd.data.name)
            await cmd.execute(client, interaction, cmd.data.name)
        } catch (error) {
            console.log(error)
        }
    } else if(interaction.isButton()){
        
        if(interaction.customId === 'btnTime'){

            const modalTimeModal = new ModalBuilder()
                .setCustomId(`${ctr}-modal-time`)
                .setTitle('Hier den Zeitpunkt eintragen')

            

            var channelFound = false;
            var currentIncident = null;
            
            if(interaction.channel.name.includes('liga-1')){
        
                IncidentManager.incidentManager.getIncidentsLiga1().forEach((inc) => {
                    
                    if(inc.getChannel().id == interaction.channel.id){
                        channelFound = true;
                        inc.setIdForModalNameTime(ctr);
                        currentIncident = inc;
                    }
                })
                if(channelFound && interaction.member.id == currentIncident.getInitiator().id){
                    console.log(`Channel ID: ${interaction.channel.id} und `)
                    modalTimeModal.addComponents(new ActionRowBuilder().addComponents(textInputTime))
                    
                    await interaction.showModal(modalTimeModal)

                }else if(interaction.member.id != currentIncident.getInitiator().id){
                    await interaction.reply(`Keine Berechtigung um diese Interaktion auszuführen`) 
                }
            } else {
                // TODO
            }    
        } else if(interaction.customId === 'btnDesc'){

            const modalDescModal = new ModalBuilder()
                .setCustomId(`${ctr}-modal-desc`)
                .setTitle('Hier die Beschreibung eintragen')

            var channelFound = false;
            
            if(interaction.channel.name.includes('liga-1')){
        
                IncidentManager.incidentManager.getIncidentsLiga1().forEach((inc) => {
                    
                    if(inc.getChannel().id == interaction.channel.id){
                        channelFound = true;
                        inc.setIdForModalNameDesc(ctr);
                    }
                })
                if(channelFound){
                    console.log(`Channel ID: ${interaction.channel.id} und `)
                    modalDescModal.addComponents(new ActionRowBuilder().addComponents(textInputDesc))
                    
                    await interaction.showModal(modalDescModal)

                }
            } else {
                // TODO
            }    
        } else if(interaction.customId === 'btnLink'){

            const modalLinkModal = new ModalBuilder()
                .setCustomId(`${ctr}-modal-link`)
                .setTitle('Hier den Link eintragen')

            var channelFound = false;
            
            if(interaction.channel.name.includes('liga-1')){
        
                IncidentManager.incidentManager.getIncidentsLiga1().forEach((inc) => {
                    
                    if(inc.getChannel().id == interaction.channel.id){
                        channelFound = true;
                        inc.setIdForModalNameLink(ctr);
                    }
                })
                if(channelFound){
                    console.log(`Channel ID: ${interaction.channel.id} und `)
                    modalLinkModal.addComponents(new ActionRowBuilder().addComponents(textInputLink))
                    
                    await interaction.showModal(modalLinkModal)

                }
            } else {
                // TODO
            }    
        } else if(interaction.customId === 'btnAcceptInc'){
            if(interaction.channel.name.includes('liga-1')){
                IncidentManager.incidentManager.getIncidentsLiga1().forEach((inc) => {
                    if(inc.getChannel().id == interaction.channel.id && interaction.member.roles.cache.has(IncidentManager.incidentManager.getStewardRolle())){
                        if(inc.getLinkSubmitted() && inc.getBeschreibungSubmitted() && inc.getZeitpunktSubmitted()){
                            var newTitel = inc.getBaseName();
                            interaction.channel.setName(newTitel).then(() => {
                                console.log(`Der Name der Vorfallchannels wurde auf ${newTitel} geändert`)
                                inc.setName(newTitel)
                                interaction.channel.bulkDelete(100).then(() => {

                                    console.log(inc.getDescription() + 'hi')

                                    const incidentFormEmbed = new EmbedBuilder()
                                    .setColor('#ff8c00')
                                    .setTitle(`Vorfall ${inc.getName()}`)
                                    .setDescription('Alle Infos zum Vorfall')
                                    .addFields(
                                        { name: 'Akzeptiert von', value: `${interaction.member}` },
                                        { name: 'Ersteller', value: `Vorfall erstellt von <@${inc.getInitiator().id}>` },
                                        { name: 'Zeitpunkt', value: `${inc.getZeitpunkt()}` },
                                        { name: 'Beschreibung', value: `${inc.getDescription()}` },
                                        { name: 'Videolink', value: `${inc.getLink()}` }
                                    )

                                    interaction.channel.send({ embeds: [incidentFormEmbed] }).then(() => {
                                        var stringIDS = '';
                                        inc.getDriversInvolved().forEach((driver) => {
                                            stringIDS = stringIDS.concat(`<@${driver.id}> `)
                                        })
                                        interaction.channel.send(`Ab jetzt kann sich jeder zu dem Vorfall äußern. ${stringIDS}am besten mit Video`).then(() => {
                                            inc.getDriversInvolved().forEach((driver) => {
                                                interaction.channel.permissionOverwrites.edit(driver.id, { SendMessages: true })
                                            })
                                        })
                                    });
                                })

                       
                            })
                        
                        }
                    }
            
                })
                
            
            } else {
                // TODO
            }
        } else if(interaction.customId == 'btnDeclineInc'){
            if(interaction.channel.name.includes('liga-1')){
                IncidentManager.incidentManager.getIncidentsLiga1().forEach((inc) => {
                    if(inc.getChannel().id == interaction.channel.id && interaction.member.roles.cache.has(IncidentManager.incidentManager.getStewardRolle())){
                        interaction.reply('Der Vorfall wurde abgewiesen');

                        var newTitel = inc.getBaseName();
                        interaction.channel.setName(newTitel + '-abgewießen')
                        inc.setName(newTitel + '-abgewießen')
                        
                        inc.getInitiator().user.send(`Dein Vorfall ${newTitel} wurde abgelehnt`);
                    }
                })
            } else {
                // TODO
            }

        } else if(interaction.customId == `btnRevision`){
            IncidentManager.incidentManager.getIncidentsLiga1().forEach((inc) => {
                if(inc.getChannel().id == interaction.channel.id){
                    interaction.channel.send(`Revision wird eingereicht`).then(() => {
                        interaction.guild.members.fetch(IncidentManager.incidentManager.getRevisionsManagerID()).then((userRev) => {
                            userRev.send(`Es wurde eine Revision im Fall ${interaction.channel.name} eingereicht`).then(() => {
                            
                                var tempName = inc.getBaseName() + '-revision';
                                console.log(tempName)
                                interaction.channel.setName(tempName);
                            })
                        })
                    }) 
                }
               
            })
        }
    } else if(interaction.type == InteractionType.ModalSubmit){
        var id = -1;
        if(interaction.customId.includes('time')){
            IncidentManager.incidentManager.getIncidentsLiga1().forEach((inc) => {
                if(inc.getChannel().id == interaction.channel.id){
                    id = inc.getIdForModalNameTime();
                }
            })
        } else if(interaction.customId.includes('desc')){
            IncidentManager.incidentManager.getIncidentsLiga1().forEach((inc) => {
                if(inc.getChannel().id == interaction.channel.id){
                    id = inc.getIdForModalNameDesc();
                }
            })
        } else if(interaction.customId.includes('link')){
            IncidentManager.incidentManager.getIncidentsLiga1().forEach((inc) => {
                if(inc.getChannel().id == interaction.channel.id){
                    id = inc.getIdForModalNameLink();
                }
            })
        }

        if(id == -1){
            return;
        }
       
        if(interaction.customId == `${id}-modal-time`){

            interaction.reply(`Dein Zeitpunkt wurde gespeichert: ${interaction.fields.getTextInputValue('textInputTime')}`).then(() => {
                IncidentManager.incidentManager.getIncidentsLiga1().forEach((inc) => {
                    console.log(inc.getChannel().id + " : " + interaction.channel.id)
                    console.log('test')
                    if(inc.getChannel().id == interaction.channel.id){

                        inc.setZeitpunkt(interaction.fields.getTextInputValue('textInputTime'))
                        inc.setZeitpunktSubmitted(true)

                        var embedInfo = new EmbedBuilder()
                        .setTitle(`Embed mit Angaben`)
                        .setDescription(`Das Embed wie es später im Vorall angezeigt`)
                        .setColor('#8a0339')
                        .addFields(
                            [
                                {name: `Zeitpunkt:`, value: `${inc.getZeitpunkt()}`},
                                {name: `Beschreibung:`, value: `${inc.getDescription()}`},
                                {name: `Link:`, value: `${inc.getLink()}`}
                            ]
                        )

                        inc.getEmbedInputMessage().delete().then(() => {
                            interaction.channel.send({ embeds: [embedInfo]}).then((embedInfoMessage) => {
                                inc.setEmbedInputMessage(embedInfoMessage);
                            })
                        })

                    }
                    console.log(interaction.fields.getTextInputValue('textInputTime'))
                    console.log(inc.getZeitpunkt())
                    console.log(inc.getZeitpunktSubmitted())

                    
                })
            
            });   

            

        }else if(interaction.customId == `${id}-modal-desc`){
            interaction.reply(`Deine Beschreibung wurde gespeichert: ${interaction.fields.getTextInputValue('textInputDesc')}`).then(() => {
                IncidentManager.incidentManager.getIncidentsLiga1().forEach((inc) => {
                    console.log('test3')
                    if(inc.getChannel().id == interaction.channel.id){
                        
                        inc.setDescription(interaction.fields.getTextInputValue('textInputDesc'))
                        inc.setBeschreibungSubmitted(true)

                        var embedInfo = new EmbedBuilder()
                        .setTitle(`Embed mit Angaben`)
                        .setDescription(`Das Embed wie es später im Vorall angezeigt`)
                        .setColor('#8a0339')
                        .addFields(
                            [
                                {name: `Zeitpunkt:`, value: `${inc.getZeitpunkt()}`},
                                {name: `Beschreibung:`, value: `${inc.getDescription()}`},
                                {name: `Link:`, value: `${inc.getLink()}`}
                            ]
                        )

                        inc.getEmbedInputMessage().delete().then(() => {
                            interaction.channel.send({ embeds: [embedInfo]}).then((embedInfoMessage) => {
                                inc.setEmbedInputMessage(embedInfoMessage);
                            })
                        })

                    }
                    console.log(interaction.fields.getTextInputValue('textInputDesc'))
                    console.log(inc.getDescription())
                    console.log(inc.getBeschreibungSubmitted())

                   
                    
                    
                })
                
            });   
        } else if(interaction.customId == `${id}-modal-link`){

            var inputLink = interaction.fields.getTextInputValue('textInputLink')

            if(!(inputLink.includes('youtube.com') || inputLink.includes('twitch.tv'))){
                interaction.reply(`Der Link wurde nicht als Youtube oder Twitch Link erkannt. Es sind nur solche Links erlaubt.`)
                return;
            }

            interaction.reply(`Dein Link wurde gespeichert: ${inputLink}`).then(() => {
                IncidentManager.incidentManager.getIncidentsLiga1().forEach((inc) => {
                   
                    if(inc.getChannel().id == interaction.channel.id){

                        inc.setLink(inputLink)
                        inc.setLinkSubmitted(true)

                        var embedInfo = new EmbedBuilder()
                            .setTitle(`Embed mit Angaben`)
                            .setDescription(`Das Embed wie es später im Vorfall angezeigt`)
                            .setColor('#8a0339')
                            .addFields(
                                [
                                    {name: `Zeitpunkt:`, value: `${inc.getZeitpunkt()}`},
                                    {name: `Beschreibung:`, value: `${inc.getDescription()}`},
                                    {name: `Link:`, value: `${inc.getLink()}`}
                                ]
                            )

                        inc.getEmbedInputMessage().delete().then(() => {
                            interaction.channel.send({ embeds: [embedInfo]}).then((embedInfoMessage) => {
                                inc.setEmbedInputMessage(embedInfoMessage)
                                console.log('here')
                                /**
                                 * 
                                 * Work in progress:
                                 * 
                                 *  if(inc.getBeschreibungSubmitted() && inc.getLinkSubmitted() && inc.getZeitpunktSubmitted()){

                                    var msg = inc.getMsgVorlage();
                                    var btnAccept = msg.components[0].components[0]
                                    var btnDecline = msg.components[0].components[1]
                                    msg.components[0].components[0].data.setDisabled(false)
                                    msg.edit({ content: `Dein Vorfall wurde erstellt <@${initiator.id}>`+
                                                            `\n ***Der Vorfall muss von den Stewards akzeptiert werden, oder der Vorfall kann abgelehnt werden.***`,
                                                            components: [new ActionRowBuilder().addComponents(btnAccept, btnDecline)]})
                                    
                                }
                                 */
                               
                                
                            })
                        })

                        

                    }
                    console.log(interaction.fields.getTextInputValue('textInputLink'))
                    console.log(inc.getLink())
                    console.log(inc.getLinkSubmitted())

                    
                })
               
            });

          

        }
        
    } 
    
      

    
}