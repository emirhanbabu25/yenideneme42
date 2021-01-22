const Discord = require('discord.js');
const moment = require('moment');
moment.locale('tr');

 
exports.run = (client, message, args) => {// can ♡ b#1010

let mention = message.author;
if(message.mentions.members.first()) mention = message.mentions.members.first().user;
let mentionMember = message.guild.members.cache.get(mention.id);
  
  exports.run = (bot, message, params) => {
  const filterLevels = ['Yok', 'Rolü Olmayanlar İçin', 'Herkes İçin']
       const tarih =  message.guild.createdAt

let kur = {
			"01": "Ocak",
			"02": "Şubat",
			"03": "Mart",
			"04": "Nisan",
			"05": "Mayıs",
			"06": "Haziran",
			"07": "Temmuz",
			"08": "Ağustos",
			"09": "Eylül",
			"10": "Ekim",
			"11": "Kasım",
			"12": "Aralık"
    }



  let sunucu = new Discord.MessageEmbed()
    .setAuthor("Sunucu Bilgi", message.guild.iconURL())
    .setThumbnail(message.guild.iconURL())
  .setColor("RANDOM")
    .addField("Sunucu İsmi", message.guild.name)
    .addField("Sunucu İdsi", message.guild.id)
    .addField("Sunucu Bölgesi", message.guild.region)
    .addField("AFK kanalı:", `${message.guild.afkChannel}`, true)
    .addField("AFK zaman aşımı:", message.guild.afkTimeout, true)
    .addField('Oluşturulma Tarihi', ` ${moment(message.guild.createdAt).format('DD')} ${kur[moment(message.guild.createdAt).format('MM')]} ${moment(message.guild.createdAt).format('YYYY h:mm:ss')}`)
    .addField(
      "Roller:",
      message.guild.roles.cache.map(role => role).join(", "),
      true
    )
    .setTimestamp()
    .setFooter(`${message.author.tag} tarafından istendi.`, message.author.avatarURL())
  
  return message.channel.send(sunucu);
};
  
  }; 
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['sunucu-bilgi'],
  permLevel: 0
};
 
exports.help = {
  name: 'ui'
};