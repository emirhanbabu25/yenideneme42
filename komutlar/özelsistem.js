const Discord = require('discord.js')
const db = require('quick.db')

exports.run = async (client ,message, args) =>{
if(args[0] === 'aç') {
    db.set(`starus_${message.guild.id}`, "acik")
    message.channel.send('Scrim Reklam Sistemi Açıldı.')
  return
}
if (args[0] === 'kapat') {
  db.delete(`starus_${message.guild.id}`)
message.channel.send('Scrim Reklam Sistemi Kapatıldı.')
return
}
  message.channel.send('**Lüten `aç` yada `kapat` Yazın!**')
};
exports.conf = {
 enabled: true,
 guildOnly: false,
 aliases: ['sta-özel'],
 permLevel: 3
};

exports.help = {
 name: 'özel',
 description: 'Davet Log Kanalını Belirler',
 usage: 'davet-kanal-ayarla #kanal'
};