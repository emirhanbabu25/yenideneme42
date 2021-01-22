  const Discord = require('discord.js');
const db = require('quick.db');
exports.run = async (app, message, client) => {
  
  const pingt = new Discord.MessageEmbed()
  .setColor("RED")
  .setDescription('Ping Hesaplanıyor...')
  
   let start = Date.now(); 
   let mesaj = await message.channel.send(pingt)
   let diff = (Date.now() - start); 
   let API = (app.ws.ping).toFixed(2)
    setInterval(() => {
   const only = new Discord.MessageEmbed()
   
   .setDescription(`\n **:signal_strength:・Mesaj Gecikme Süresi** \n **${diff} Ms** \n\n **:computer:・Bot Gecikmesi** \n ${API} Ms`)
   .setColor('GREEN')
     mesaj.edit(only);
    }, )
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['ms'],
  permLevel: 0
};

exports.help = {
  name: 'ping',
  description: 'Thorcuk V12 Ping',
  usage: 'ping'
};