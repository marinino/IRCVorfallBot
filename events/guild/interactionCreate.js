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
        
        var date = new Date().toLocaleString()
        console.log(`Interaktion mit ID ${ctr} von ${interaction.user.username} wurde festgestellt. Die Interaktion hat den Typ Button. -- ${date}`)

        if(interaction.customId === 'btnTime'){

            var date = new Date().toLocaleString()
            console.log(`Die Interaktion mit ID ${ctr} wurde zur Eingabe eines Zeitpunkts` +
                        ` von ${interaction.user.username} gemacht. -- ${date}`)

            const modalTimeModal = new ModalBuilder()
                .setCustomId(`${ctr}-modal-time`)
                .setTitle('Hier den Zeitpunkt eintragen')

            var channelFound = false;
            var currentIncident = null;
            
            if(interaction.channel.name.includes('liga-1')){

                var date = new Date().toLocaleString()
                console.log(`Die Interaktion mit ID ${ctr} wurde im Vorfall mit Namen ${interaction.channel.name} getätigt,` +
                            ` daher wird er in Liga 1 gesucht. -- ${date}`)

                IncidentManager.incidentManager.getIncidentsLiga1().forEach((inc) => {
                    if(inc.getChannel().id == interaction.channel.id){

                        var date = new Date().toLocaleString()
                        console.log(`Der Vorfall in dem die Interaktion mit der ID ${ctr} getätigt wurde, wurde gefunden. -- ${date}`)
        
                        channelFound = true;
                        inc.setIdForModalNameTime(ctr);
                        currentIncident = inc;
                    } else {
                        var date = new Date().toLocaleString()
                        console.log(`Es konnte kein Vorfall gefunden werden der zum Kanal der Interaktion mit ID ${ctr} passt. -- ${date}`)
                    }
                })
                if(channelFound && interaction.member.id == currentIncident.getInitiator().id){
                    modalTimeModal.addComponents(new ActionRowBuilder().addComponents(textInputTime))
                    
                    await interaction.showModal(modalTimeModal)

                    var date = new Date().toLocaleString()
                    console.log(`Der Kanal zum Vorfall ${interaction.channel.name} wurde gefunden und der Ersteller hat die Interaktion mit ` + 
                                `der ID ${ctr} durchgeführt. Das Modal zum Eingeben des Zeitpunktes wurde geöffnet und die Interaktion somit ` + 
                                `erfolgreich abgeschlossen.  -- ${date}`)

                }else if(interaction.member.id != currentIncident.getInitiator().id){
                    await interaction.reply(`Diese Buttons sind nur für den Ersteller des Vorfalls benutzbar. ` +
                                            `Der Vorfall muss akzeptiert werden bevor sich die die anderen Beteiligten äußern können. ` + 
                                            `Wenn die anderen Beteiligten sich äußern können, werden diese markiert.`) 

                    var date = new Date().toLocaleString()
                    console.log(`Die Interaktion mit der ID ${ctr} wurde von ${interaction.user.username} durchgeführt, dieser wurde nicht ` + 
                                `als Ersteller erkannt. -- ${date}`)
                }
            } else {
                // TODO
            }    
        } else if(interaction.customId === 'btnDesc'){

            var date = new Date().toLocaleString()
            console.log(`Die Interaktion mit ID ${ctr} wurde zur Eingabe einer Beschreibung` +
                        ` von ${interaction.user.username} gemacht. -- ${date}`)

            const modalDescModal = new ModalBuilder()
                .setCustomId(`${ctr}-modal-desc`)
                .setTitle('Hier die Beschreibung eintragen')

            var channelFound = false;
            
            if(interaction.channel.name.includes('liga-1')){

                var date = new Date().toLocaleString()
                console.log(`Die Interaktion mit ID ${ctr} wurde im Vorfall mit Namen ${interaction.channel.name} getätigt,` +
                            ` daher wird er in Liga 1 gesucht. -- ${date}`)

                IncidentManager.incidentManager.getIncidentsLiga1().forEach((inc) => {
                    if(inc.getChannel().id == interaction.channel.id){

                        var date = new Date().toLocaleString()
                        console.log(`Der Vorfall in dem die Interaktion mit der ID ${ctr} getätigt wurde, wurde gefunden. -- ${date}`)

                        channelFound = true;
                        inc.setIdForModalNameDesc(ctr);
                        currentIncident = inc
                    } else {
                        var date = new Date().toLocaleString()
                        console.log(`Es konnte kein Vorfall gefunden werden der zum Kanal der Interaktion mit ID ${ctr} passt. -- ${date}`)
                    }
                })
                if(channelFound && interaction.member.id == currentIncident.getInitiator().id){
                    modalDescModal.addComponents(new ActionRowBuilder().addComponents(textInputDesc))
                    
                    await interaction.showModal(modalDescModal)

                    var date = new Date().toLocaleString()
                    console.log(`Der Kanal zum Vorfall ${interaction.channel.name} wurde gefunden und der Ersteller hat die Interaktion mit ` + 
                                `der ID ${ctr} durchgeführt. Das Modal zum Eingeben der Beschreibung wurde geöffnet und die Interaktion somit ` + 
                                `erfolgreich abgeschlossen.  -- ${date}`)
                } else if(interaction.member.id != currentIncident.getInitiator().id){
                    await interaction.reply(`Diese Buttons sind nur für den Ersteller des Vorfalls benutzbar. ` +
                                            `Der Vorfall muss akzeptiert werden bevor sich die die anderen Beteiligten äußern können. ` + 
                                            `Wenn die anderen Beteiligten sich äußern können, werden diese markiert.`) 

                    var date = new Date().toLocaleString()
                    console.log(`Die Interaktion mit der ID ${ctr} wurde von ${interaction.user.username} durchgeführt, dieser wurde nicht ` + 
                                `als Ersteller erkannt. -- ${date}`)
                }
            } else {
                // TODO
            }    
        } else if(interaction.customId === 'btnLink'){

            var date = new Date().toLocaleString()
            console.log(`Die Interaktion mit ID ${ctr} wurde zur Eingabe eines Links` +
                        ` von ${interaction.user.username} gemacht. -- ${date}`)

            const modalLinkModal = new ModalBuilder()
                .setCustomId(`${ctr}-modal-link`)
                .setTitle('Hier den Link eintragen')

            var channelFound = false;
            
            if(interaction.channel.name.includes('liga-1')){

                var date = new Date().toLocaleString()
                console.log(`Die Interaktion mit ID ${ctr} wurde im Vorfall mit Namen ${interaction.channel.name} getätigt,` +
                            ` daher wird er in Liga 1 gesucht. -- ${date}`)

                IncidentManager.incidentManager.getIncidentsLiga1().forEach((inc) => {
                    if(inc.getChannel().id == interaction.channel.id){

                        var date = new Date().toLocaleString()
                        console.log(`Der Vorfall in dem die Interaktion mit der ID ${ctr} getätigt wurde, wurde gefunden. -- ${date}`)

                        channelFound = true;
                        inc.setIdForModalNameLink(ctr);
                        currentIncident = inc
                    } else {
                        var date = new Date().toLocaleString()
                        console.log(`Es konnte kein Vorfall gefunden werden der zum Kanal der Interaktion mit ID ${ctr} passt. -- ${date}`)
                    }
                })
                if(channelFound && interaction.member.id == currentIncident.getInitiator().id){
                    modalLinkModal.addComponents(new ActionRowBuilder().addComponents(textInputLink))
                    
                    await interaction.showModal(modalLinkModal)

                    var date = new Date().toLocaleString()
                    console.log(`Der Kanal zum Vorfall ${interaction.channel.name} wurde gefunden und der Ersteller hat die Interaktion mit ` + 
                                `der ID ${ctr} durchgeführt. Das Modal zum Eingeben der Beschreibung wurde geöffnet und die Interaktion somit ` + 
                                `erfolgreich abgeschlossen.  -- ${date}`)
                } else if(interaction.member.id != currentIncident.getInitiator().id){
                    await interaction.reply(`Diese Buttons sind nur für den Ersteller des Vorfalls benutzbar. ` +
                                            `Der Vorfall muss akzeptiert werden bevor sich die die anderen Beteiligten äußern können. ` + 
                                            `Wenn die anderen Beteiligten sich äußern können, werden diese markiert.`) 

                    var date = new Date().toLocaleString()
                    console.log(`Die Interaktion mit der ID ${ctr} wurde von ${interaction.user.username} durchgeführt, dieser wurde nicht ` + 
                                `als Ersteller erkannt. -- ${date}`)
                }
            } else {
                // TODO
            }    
        } else if(interaction.customId === 'btnAcceptInc'){

            var date = new Date().toLocaleString()
            console.log(`Die Interaktion mit ID ${ctr} wurde zum akzeptieren eines Vorfalls` +
                        ` von ${interaction.user.username} gemacht. -- ${date}`)

            if(interaction.channel.name.includes('liga-1')){

                var date = new Date().toLocaleString()
                console.log(`Die Interaktion mit ID ${ctr} wurde im Vorfall mit Namen ${interaction.channel.name} getätigt,` +
                            ` daher wird er in Liga 1 gesucht. -- ${date}`)

                IncidentManager.incidentManager.getIncidentsLiga1().forEach(async (inc) => {
                    if(inc.getChannel().id == interaction.channel.id && interaction.member.roles.cache.has(IncidentManager.incidentManager.getStewardRolle())){
                        if(inc.getLinkSubmitted() && inc.getBeschreibungSubmitted() && inc.getZeitpunktSubmitted()){

                            var date = new Date().toLocaleString()
                            console.log(`Der Vorfall ${interaction.channel.name} wurde gefunden, der Akteur der Interaktion war ein Steward ` + 
                                        `und es wurden alle wichtigen Angaben zum Vorfall angegeben. Der Vorfall ${interaction.channel.name} ` + 
                                        `konnte also erfolgreich akzeptiert werden -- ${date}`)

                            var newTitel = inc.getBaseName();
                            await interaction.channel.setName(newTitel)
                            var date = new Date().toLocaleString()
                            console.log(`Der Name der Vorfallchannels wurde erfolgreich zu ${newTitel} geändert -- ${date}`)
                            inc.setName(newTitel)
                            await interaction.channel.bulkDelete(100)
                            var date = new Date().toLocaleString()
                            console.log(`Der Channel ${interaction.channel.name} wurde erfolgreich gecleart. -- ${date}`)

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

                            await interaction.channel.send({ embeds: [incidentFormEmbed] })
                            var date = new Date().toLocaleString()
                            console.log(`Das Embed mit den Informationen zum Vorfall wurde erfolgreich in Channel ` + 
                                        `${interaction.channel.name} geschickt. -- ${date}`)

                            var stringIDS = '';
                            inc.getDriversInvolved().forEach((driver) => {
                                stringIDS = stringIDS.concat(`<@${driver.id}> `)
                            })
                            await interaction.channel.send(`Ab jetzt kann sich jeder zu dem Vorfall äußern. ${stringIDS}am besten mit Video`)
                            inc.getDriversInvolved().forEach(async (driver) => {
                                await interaction.channel.permissionOverwrites.edit(driver.id, { SendMessages: true })
                            })
                            var date = new Date().toLocaleString()
                            console.log(`Die anderen Beteiligten wurden markiert und haben nun Schreibrechte. Der Vorfall ${interaction.channel.name}` +
                                        `wurde erfolgreich akzeptiert -- ${date}`)
                        }
                    }
                })
            } else {
                // TODO
            }
        } else if(interaction.customId == 'btnDeclineInc'){

            var date = new Date().toLocaleString()
            console.log(`Die Interaktion mit ID ${ctr} wurde zum ablehnen eines Vorfalls` +
                        ` von ${interaction.user.username} gemacht. -- ${date}`)

            if(interaction.channel.name.includes('liga-1')){

                var date = new Date().toLocaleString()
                console.log(`Die Interaktion mit ID ${ctr} wurde im Vorfall mit Namen ${interaction.channel.name} getätigt,` +
                            ` daher wird er in Liga 1 gesucht. -- ${date}`)

                IncidentManager.incidentManager.getIncidentsLiga1().forEach(async (inc) => {
                    if(inc.getChannel().id == interaction.channel.id && interaction.member.roles.cache.has(IncidentManager.incidentManager.getStewardRolle())){
                        await interaction.reply('Der Vorfall wurde abgewiesen');
                        var newTitel = inc.getBaseName();
                        await interaction.channel.setName(newTitel + '-abgewießen')
                        var date = new Date().toLocaleString()
                        console.log(`Der Name des Channels wurde erfolgreich auf ${newTitel + '-abgewießen'} geändert. -- ${date}`)
                        inc.setName(newTitel + '-abgewießen')
                        await inc.getInitiator().user.send(`Dein Vorfall ${newTitel} wurde abgelehnt`);
                        var date = new Date().toLocaleString()
                        console.log(`Dem Ersteller wurde erfolgreich mitgeteilt, dass Vorfall ${interaction.channel.name} abgelehnt wurde. -- ${date}`)
                    }
                })
            } else {
                // TODO
            }

        } else if(interaction.customId == `btnRevision`){

            var date = new Date().toLocaleString()
            console.log(`Die Interaktion mit ID ${ctr} wurde zum ablehnen eines Vorfalls` +
                        ` von ${interaction.user.username} gemacht. -- ${date}`)

            if(interaction.channel.name.includes('liga-1')){

                var date = new Date().toLocaleString()
                console.log(`Die Interaktion mit ID ${ctr} wurde im Vorfall mit Namen ${interaction.channel.name} getätigt,` +
                            ` daher wird er in Liga 1 gesucht. -- ${date}`)

                IncidentManager.incidentManager.getIncidentsLiga1().forEach(async (inc) => {
                    if(inc.getChannel().id == interaction.channel.id){
                        await interaction.channel.send(`Revision wird eingereicht`)
                        var date = new Date().toLocaleString()
                        console.log(`Die Revision wurde per Nachricht im Channel vermerkt. -- ${date}`)
                        var userForRevision = await interaction.guild.members.fetch(IncidentManager.incidentManager.getRevisionsManagerID())
                        await userForRevision.send(`Es wurde eine Revision im Fall ${interaction.channel.name} eingereicht`)
                        var date = new Date().toLocaleString()
                        console.log(`Dem Revisionsmanager wurde eine private Nachricht geschickt um ihn zu informieren. -- ${date}`)
                        var tempName = inc.getBaseName() + '-revision';
                        await interaction.channel.setName(tempName);
                        var date = new Date().toLocaleString()
                        console.log(`Der Name des Channels wurde erfolgreich auf ${newTitel + '-revision'} geändert. -- ${date}`)
                    } 
                })
            }

           
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
                IncidentManager.incidentManager.getIncidentsLiga1().forEach(async (inc) => {
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

                        await inc.getEmbedInputMessage().delete()
                        var embedInfoMessage = await interaction.channel.send({ embeds: [embedInfo]})
                        inc.setEmbedInputMessage(embedInfoMessage);  
                    }  
                })
            });  
        }else if(interaction.customId == `${id}-modal-desc`){
            await interaction.reply(`Deine Beschreibung wurde gespeichert: ${interaction.fields.getTextInputValue('textInputDesc')}`)
            IncidentManager.incidentManager.getIncidentsLiga1().forEach(async (inc) => {
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

                    await inc.getEmbedInputMessage().delete()
                    var embedInfoMessage = await interaction.channel.send({ embeds: [embedInfo]})
                    inc.setEmbedInputMessage(embedInfoMessage);
                }            
            })
        } else if(interaction.customId == `${id}-modal-link`){

            var inputLink = interaction.fields.getTextInputValue('textInputLink')

            if(!(inputLink.includes('youtu.be') || inputLink.includes('youtube.com') || inputLink.includes('twitch.tv'))){
                interaction.reply(`Der Link wurde nicht als Youtube oder Twitch Link erkannt. Es sind nur solche Links erlaubt.`)
                return;
            }

            await interaction.reply(`Dein Link wurde gespeichert: ${inputLink}`)
            IncidentManager.incidentManager.getIncidentsLiga1().forEach(async (inc) => {
                
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

                    await inc.getEmbedInputMessage().delete()
                    var embedInfoMessage = await interaction.channel.send({ embeds: [embedInfo]})
                    inc.setEmbedInputMessage(embedInfoMessage)

                    /**
                     * 
                     * Work in progress:
                     * 
                    if(inc.getBeschreibungSubmitted() && inc.getLinkSubmitted() && inc.getZeitpunktSubmitted()){

                        var msg = inc.getMsgVorlage();
                        var btnAccept = msg.components[0].components[0]
                        var btnDecline = msg.components[0].components[1]
                        msg.components[0].components[0].data.setDisabled(false)
                        msg.edit({ content: `Dein Vorfall wurde erstellt <@${initiator.id}>`+
                                                `\n ***Der Vorfall muss von den Stewards akzeptiert werden, oder der Vorfall kann abgelehnt werden.***`,
                                                components: [new ActionRowBuilder().addComponents(btnAccept, btnDecline)]})
                        
                    }
                    */
                }         
            })     
        }
    }      
}