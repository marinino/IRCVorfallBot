const {ActivityType} = require('discord.js')

const labereckeID = "947229978209173534";
const discordID = "947229969438896128";
const commandsBotID = "604645537882308609";

const options = [
    {
        type: ActivityType.Watching,
        text: "twitch.tv/ircf1de",
        status: "online"
    },
    {
        type: ActivityType.Listening,
        text: "Vorfälle",
        status: "dnd",
    },
    {
        type: ActivityType.Playing,
        text: "FIFA 23",
        status: "idle"
    }
]

module.exports = (client) => {

    client.managePresence = async () => {

        

        var currentDate = new Date();
        var midnightDate = new Date();
        midnightDate.setHours(11, 03, 30)

        var differnceInMs = midnightDate -currentDate
        var currentDateWait = new Date().toLocaleString();
        console.log(`Waiting for midnight... ${currentDateWait}`)

        setTimeout(() => {
            var currentDateMid = new Date().toLocaleString();
            console.log(`Its midnight go sleepmode, ${currentDateMid}`)
            setPresence(2, client) //Nightmode
            
            setTimeout(() => {
                setPresence(1, client)
                var currentDateDay = new Date().toLocaleString();
                console.log(`Now we are in daymode, ${currentDateDay}`)
            }, 10000)
            setInterval(() => {
                setPresence(2, client)
                var currentDateSleep = new Date().toLocaleString();
                console.log(`Now we are in sleepmode, ${currentDateSleep}`)
                setTimeout(() => {
                    setPresence(1, client)
                    var currentDateDay = new Date().toLocaleString();
                    console.log(`Now we are in daymode, ${currentDateDay}`)
                }, 10000)
            }, 10000* 4 )
        }, differnceInMs);

        
        


        console.log('called')
        const messageCollector = client.guilds.cache.get(discordID).channels.cache.get(labereckeID).createMessageCollector()

        messageCollector.on('collect', message => {
            console.log('collected')
            console.log(message.member.id + " " + message.content)
            if(message.member.id == commandsBotID && message.content.includes('Wir sind live! schaut doch vorbei!')){
                setPresence(0, client)
            }
            setTimeout(() => {
                setPresence(1, client)
            }, 5 * 1000)
        })
    
        
        
    }
}

function setPresence(option, client){
    client.user.setPresence(
        {
            activities: [
                {
                    name: options[option].text,
                    type: options[option].type,
                },
            ],
            status: options[option].status,
        }
    )
}
   

   
