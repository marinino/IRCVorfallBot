const Discord = require('discord.js');
const { Client, Intents, Collection, GatewayIntentBits } = require('discord.js');
require('dotenv').config();
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');
const mysql = require('mysql');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.MessageContent],});

client.commands = new Discord.Collection();
client.events = new Discord.Collection();

const connection = mysql.createConnection({
  host     : '127.0.0.1',
  port     : '3308',
  user     : 'root',
  password : 'Minecraft18!',
  database : 'db_irc_test'
});

connection.connect();

connection.query('CREATE TABLE IF NOT EXISTS incidents_testserver ('+
  'inc_id INT NOT NULL,' +
  'basename LONGTEXT,' +
  'current_name LONGTEXT,' +
  'initiator BIGINT,'+
  'drivers_involved LONGTEXT,'+
  'channel BIGINT,'+
  "description LONGTEXT,"+
  "point_in_time LONGTEXT,"+
  "link LONGTEXT,"+
  'description_submitted BOOL DEFAULT 0,'+
  'link_submitted BOOL DEFAULT 0,'+
  'point_in_time_submitted BOOL DEFAULT 0,'+
  'msg_vorlage BIGINT,'+
  'msg_zeitpunkt BIGINT,'+
  'msg_description BIGINT,'+
  'msg_link BIGINT,'+
  'id_for_modal_name_time BIGINT DEFAULT -1,'+
  'id_for_modal_name_description BIGINT DEFAULT -1,'+
  'id_for_modal_name_link BIGINT DEFAULT -1,'+
  'embed_input_message BIGINT,'+
  'PRIMARY KEY (inc_id))', function(error, results, fields){
    console.log(error)
    console.log(results)
});


['command_handler' , 'event_handler', 'presence_handler'].forEach(handler =>{
  require(`./handlers/${handler}`)(client, Discord, connection);
});


const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
let commands = [];

client.commands = new Discord.Collection();

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  console.log(command)
	commands.push(command.data.toJSON());
  client.commands.set(command.data.name, command)
}

client.once("ready", () => {
 
  const clientId = client.user.id;
  const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);
  const guildId = '947229969438896128';

  (async () => {
    try {
      
      
      console.log('Started refreshing application (/) commands.');

      if(process.env.ENV === 'production'){

        /*
        rest.get(Routes.applicationGuildCommands(clientId, guildId))
        .then(data => {
            const promises = [];
            for (const command of data) {
                const deleteUrl = `${Routes.applicationGuildCommands(clientId, guildId)}/${command.id}`;
                promises.push(rest.delete(deleteUrl));
            }
            return Promise.all(promises);
        });
        */


        await rest.put(
          Routes.applicationCommands(clientId),
          { body: commands.values() },
        );
        console.log('Registered globally')
      }else{

        console.log(await rest.get(
          Routes.applicationGuildCommands(clientId, guildId),
          
        ))

        /*
        rest.get(Routes.applicationGuildCommands(clientId, guildId))
        .then(data => {
            const promises = [];
            for (const command of data) {
                const deleteUrl = `${Routes.applicationGuildCommands(clientId, guildId)}/${command.id}`;
                promises.push(rest.delete(deleteUrl));
            }
            return Promise.all(promises);
        });
        */


        console.log(await rest.get(
          Routes.applicationGuildCommands(clientId, guildId),
          
        ))
       
        await rest.put(
          Routes.applicationGuildCommands(clientId, guildId),
          { body: commands },
        );
        console.log('Registered locally')
      }
      console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
      console.error(error);
    }
  })();

})



client.login(process.env.TOKEN);
