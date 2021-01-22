const Discord = require("discord.js");
const client = new Discord.Client();

exports.run = (client, message, args) => {
  var s = message.guild.fetchBans().then(bans => {
  message.channel.send(`Bulunduğunuz Sunucda **${bans.size}** Banlı Üye Var`)
  })
 };

  exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 1
};
exports.help = {
  name: "banlananlar",
  usage: "banlar"
};
