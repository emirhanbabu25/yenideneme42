const Discord = require('discord.js'); 
const db = require('quick.db'); 
const ayarlar = require('../ayarlar.json')
exports.run = async (client, message, args) => { 
let p = await db.fetch(`prefix.${message.guild.id}`) || ayarlar.prefix
if (!message.guild) return;


const sayfa = [`**${message.guild.name} | Sunucu Ayarları**\n**Botun Prefixi :** \`${p}\` \n**Reklam Engel:** ${db.fetch(`reklam_${message.guild.id}`) ? ` \`Açık\` ` : `\`Kapalı\` ` }\n**Küfür Engel:** ${db.fetch(`kufur_${message.guild.id}`) ? ` \`Açık\` ` : ` \`Kapalı\` ` }`]
const ayarReis = new Discord.MessageEmbed() 
.setColor(0xffd100) 
.setDescription(sayfa)
.setFooter(`${message.author.tag} tarafından istendi.`, message.author.avatarURL())
message.channel.send(ayarReis) 
}; 

exports.conf = {
  enabled: true,
  guildonly: false,
  aliases: ["sunucu-ayarlar"],
  permlevel: 0
};
exports.help = {
  name: "ayarlar",
  description: "sunucu ayarları",
  usage: "-k @kullanıcı isim yaş"
};
