const cooldowns = new Map();

module.exports = (client,  Discord, message) =>{
  const prefix = '%';

  if(!message.content.startsWith(prefix) || message.author.bot){
    return;
  }

  const args = message.content.slice(prefix.length).split(/ +/);
  var cmdHigh = args.shift();
  const cmd = cmdHigh.toLowerCase();

  const command = client.commands.get(cmd) || client.commands.find(a => a.aliases && a.aliases.includes(cmd));

  try{

    if(!cooldowns.has(command.name)){
      cooldowns.set(command.name, new Discord.Collection());
    }

    const current_time = Date.now();
    const time_stamps = cooldowns.get(command.name);
    const cooldown_amount = (command.cooldown) * 1000;

    if(time_stamps.has(message.author.id)){
      const expiration_time = time_stamps.get(message.author.id) + cooldown_amount;

      if(current_time < expiration_time){
        const time_left = (expiration_time - current_time) / 1000;

        return message.reply(`Cooldown left: ${time_left.toFixed(1)} ms`)
      }
    }

    time_stamps.set(message.author.id, current_time);
    setTimeout(() => time_stamps.delete(message.author.id), cooldown_amount);

    
    command.execute(client, message, cmd, args, Discord);
    
  } catch(error){
    message.reply('Der Command konnte nicht ausgeführt werden, wahrscheinlich hast du dich verschrieben.' + '\n'
                    + 'Führe den %commandslist Command aus um die Liste an Commands zu sehen.');
    console.log(`${error}` + `\n` + `Bot läuft noch...`);
  }
}