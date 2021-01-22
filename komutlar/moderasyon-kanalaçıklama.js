const Discord = require('discord.js');


exports.run = (msg, message) => {
  var konu = message.content.split(' ').slice(1).join(' ');
     
  if (!message.member.hasPermission("MANAGE_CHANNELS")) return message.reply(':x:Komutu kullanmak için yetkin yeterli değil. `Kanalları Yönet` yetkisine sahip olmalısın.');
      
  if (!konu) return message.reply("Kanal açıklamasını yazman gerekiyor!")
  
  message.channel.setTopic(`${konu}`)
  .then(newChannel => message.channel.send(`Başarılı! Kanalın Açıklaması ____***${konu}***____ Olarak Değiştirildi.`))
  .catch(console.error);
};    

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0,
  kategori:'yetkili'
};
     
exports.help = {
  name: 'kanalaçıklama',
  description: 'Yazılan kanalın açıklamasını değiştirir',
  usage: 'kanalaçıklama'
}; 