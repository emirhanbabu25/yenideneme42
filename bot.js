const fs=require('fs');
const Discord=require("discord.js");
const client=new Discord.Client();
const db = require('quick.db')
const moment = require("moment");
const ayarlar=require("./ayarlar.json");
const express = require('express');
/////
const app = express()
app.get('/', (req, res) => res.send("Bot Aktif"))
app.listen(process.env.PORT, () => console.log('Port ayarlandı: ' + process.env.PORT))
//////////////////



client.on("message", message => {
  let client = message.client;
  if (message.author.bot) return;
  if (!message.content.startsWith(ayarlar.prefix)) return;
  let command = message.content.split(' ')[0].slice(ayarlar.prefix.length);
  let params = message.content.split(' ').slice(1);
  let perms = client.yetkiler(message);
  let cmd;
  if (client.commands.has(command)) {
    cmd = client.commands.get(command);
  } else if (client.aliases.has(command)) {
    cmd = client.commands.get(client.aliases.get(command));
  }
  if (cmd) {
    if (perms < cmd.conf.permLevel) return;
    cmd.run(client, message, params, perms, );
  }
})

const bot = new Discord.Client();

var oyun = [
`⚡️s!yardım | s!davet`,
`🌟 Prefix ayarlamak için | s!prefix`,
`⚙️v12 Güncellemesi İle Yeni Sistemler`
]
  
client.on("ready", () => {
setInterval(function() {

         var random = Math.floor(Math.random()*(oyun.length-0+1)+0);
         client.user.setActivity(oyun[random], {"type": "WATCHING"});

        }, 2 * 5000);
});




const log = message => {
  console.log(`[${moment().format("YYYY-MM-DD HH:mm:ss")}] ${message}`);
};


client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir('./komutlar/', (err, files) => {
  if (err) console.error(err);
  log(`${files.length} adet komut yüklemeye hazırlanılıyor.`);
  files.forEach(f => {
    let props = require(`./komutlar/${f}`  );
    log(`Yüklenen komut ismi: ${props.help.name.toUpperCase()}.`);
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
    });
  });
});


client.reload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e){
      reject(e);
    }
  });
};

client.load = command => {
  return new Promise((resolve, reject) => {
    try {
      let cmd = require(`./komutlar/${command}`);
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e){
      reject(e);
    }
  });
};

client.unload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      resolve();
    } catch (e){
      reject(e);
    }
  });
};

  
client.yetkiler = message => {
  if(!message.guild) {
	return; }
  let permlvl = 0;
  if(message.member.hasPermission("MANAGE_MESSAGES")) permlvl = 1;
  if(message.member.hasPermission("KICK_MEMBERS")) permlvl = 2;
  if(message.member.hasPermission("BAN_MEMBERS")) permlvl = 3;
  if(message.member.hasPermission("MANAGE_GUILD")) permlvl = 4;
  if(message.member.hasPermission("ADMINISTRATOR")) permlvl = 5;
  if(message.author.id === message.guild.ownerID) permlvl = 6;
  if(message.author.id === ayarlar.sahip) permlvl = 7;
  return permlvl;
};


// Reklam

client.on("message", msg => {
 if(!db.has(`reklam_${msg.guild.id}`)) return;
        const reklam = [".com", ".net", ".xyz", ".tk", ".pw", ".io", ".me", ".gg", "www.", "https", "http", ".gl", ".org", ".com.tr", ".biz", "net", ".rf.gd", ".az", ".party", "discord.gg",];
        if (reklam.some(word => msg.content.includes(word))) {
          try {
            if (!msg.member.hasPermission("BAN_MEMBERS")) {
                  msg.delete();
                    return msg.reply('**Bu Sunucuda** `Reklam Engelle`** Aktif Reklam Yapmana İzin Vermem!**').then(msg => msg.delete(3000));
   
 
  msg.delete(3000);                              
 
            }              
          } catch(err) {
            console.log(err);
          }
        }
    });

// reklam kick

client.on("message", async message => {
  
  const lus = await db.fetch(`reklamkick_${message.guild.id}`)
    let sayı = await db.fetch(`sayı_${message.author.id}`);
let a = message.author
  if (lus) {
    const reklamengel = ["discord.app", "discord.gg", ".party", ".com", ".az", ".net", ".io", ".gg", ".me", "https", "http", ".com.tr", ".org", ".tr", ".gl", "glicht.me/", ".rf.gd", ".biz", "www.", "www"];
    if (reklamengel.some(word => message.content.toLowerCase().includes(word))) {
      try {
        if (!message.member.permissions.has('KICK_MEMBERS')) {
          message.delete();
          db.add(`sayı_${message.author.id}`, 1)
          if (sayı == null) {
            const sa = new Discord.MessageEmbed()
            .setDescription(`Hey! <@${message.author.id}> Bu İlk Uyarın Lütfen Tekrarlama!`)
            message.channel.send(sa)
            message.delete()
            a.send(`Bu İlk Uyarın Lütfen Tekrarlama`)
            return 
          }
         if (sayı === 1) {
               const sa = new Discord.MessageEmbed()
            .setDescription(`Hey! <@${message.author.id}> Bu İkinci Uyarın Lütfen Tekrarlama!`)
            message.channel.send(sa)
            message.delete()
            a.send(`Bu İkinci Uyarın Lütfen Tekrarlama`)
            return 
         }
            if (sayı > 2) {
               const sa = new Discord.MessageEmbed()
            .setDescription(`Hey! <@${message.author.id}> Reklamdan Dolayı Kickledim!`)
            message.channel.send(sa)
            message.delete()
            a.send(`${message.guild.name} Sunucusundan Reklam Yaptığın İçin Kicklendin!`)
                db.delete(`sayı_${message.author.id}`)
message.guild.member(a).kick();     
              return
            }
          
        }
      } catch(err) {
        console.log(err);
    }
  }
}
if (!lus) return;
});


// Küfür

client.on("message", async msg => {
  
  
 const i = await db.fetch(`kufur_${msg.guild.id}`)
    if (i == "acik") {
        const kufur = ["oç", "amk", "ananı sikiyim", "ananıskm", "piç", "amk", "amsk", "sikim", "sikiyim", "orospu çocuğu", "piç kurusu", "kahpe", "orospu", "mal", "sik", "yarrak", "am", "amcık", "amık", "yarram", "sikimi ye", "mk", "mq", "aq", "ak", "amq","sg"];
        if (kufur.some(word => msg.content.includes(word))) {
          try {
            if (!msg.member.hasPermission("BAN_MEMBERS")) {
                  msg.delete();
                          
                      return msg.reply('Bu Sunucuda Küfür Filtresi Aktiftir.')
            }              
          } catch(err) {
            console.log(err);
          }
        }
    }
    if (!i) return;
});

client.on("messageUpdate", (oldMessage, newMessage) => {
  
  
 const i = db.fetch(`${oldMessage.guild.id}.kufur`)
    if (i) {
        const kufur = ["oç", "amk", "ananı sikiyim", "ananıskm", "piç", "amk", "amsk", "sikim", "sikiyim", "orospu çocuğu", "piç kurusu", "kahpe", "orospu", "mal", "sik", "yarrak", "am", "amcık", "amık", "yarram", "sikimi ye", "mk", "mq", "aq", "ak", "amq","sg"];
        if (kufur.some(word => newMessage.content.includes(word))) {
          try {
            if (!oldMessage.member.hasPermission("BAN_MEMBERS")) {
                  oldMessage.delete();
                          
                      return oldMessage.reply('Bu Sunucuda Küfür Filtresi Aktiftir.')
            }              
          } catch(err) {
            console.log(err);
          }
        }
    }
    if (!i) return;
});
 
// Sa as

client.on("message", async msg => {
 
 
  const i = await db.fetch(`ssaass_${msg.guild.id}`);
    if (i == 'acik') {
      if (msg.content.toLowerCase() == 'sa' || msg.content.toLowerCase() == 's.a' || msg.content.toLowerCase() == 'selamun aleyküm' || msg.content.toLowerCase() == 'sea'|| msg.content.toLowerCase() == 'selam') {
          try {
 
                  return msg.reply('Aleyküm Selam, Hoşgeldin')
          } catch(err) {
            console.log(err);
          }
      }
    }
    else if (i == 'kapali') {
   
    }
    if (!i) return;
 
    });

client.login(ayarlar.token)


// otorol

client.on("guildMemberAdd", async member => {
  let kanal = await db.fetch(`otoRK_${member.guild.id}`);
  let rol = await db.fetch(`otoRL_${member.guild.id}`);
  let mesaj = db.fetch(`otoRM_${member.guild.id}`);
  if (!rol) return;

  if (!mesaj) {
    client.channels.cache.get(kanal).send(":loudspeaker: :inbox_tray: `" + member.user.username + "`** Hoş Geldin! Otomatik Rolün Verildi Seninle Beraber** `" + member.guild.memberCount + "` **Kişiyiz!**");
    return member.roles.add(rol);
  }

  if (mesaj) {
    var mesajs = mesaj.replace("-uye-", `${member.user}`).replace("-uyetag-", `${member.user.tag}`).replace("-rol-", `${member.guild.roles.cache.get(rol).name}`).replace("-server-", `${member.guild.name}`).replace("-uyesayisi-", `${member.guild.memberCount}`).replace("-botsayisi-", `${member.guild.members.cache.filter(m => m.user.bot).size}`).replace("-bolge-", `${member.guild.region}`).replace("-kanalsayisi-", `${member.guild.channels.cache.size}`);
    member.roles.add(rol);
    return client.channels.cache.get(kanal).send(mesajs);
     }
});

client.on('message', async msg => {
  let ozelkomut = await db.fetch(`sunucuKomut_${msg.guild.id}`);
  let ozelkomutYazi;
  if (ozelkomut == null) ozelkomutYazi = 'Burayı silme yoksa hatalı olur'
  else ozelkomutYazi = ''+ ozelkomut +''
  if (msg.content.toLowerCase() === ozelkomutYazi) {
      let mesaj = await db.fetch(`sunucuMesaj_${msg.guild.id}`);
  let mesajYazi;
  if (mesaj == null) mesajYazi = 'Burayı silme yoksa hatalı olur'
  else mesajYazi = ''+ mesaj +''
    msg.channel.send(mesajYazi)
  }
});



// ever-here engelle

client.on("message", async msg => {
  let hereengelle = await db.fetch(`hereengel_${msg.guild.id}`);
  if (hereengelle == "acik") {
    const here = ["@here", "@everyone"];
    if (here.some(word => msg.content.toLowerCase().includes(word))) {
      if (!msg.member.hasPermission("ADMINISTRATOR")) {
        msg.delete();
        msg.channel
          .send(`<@${msg.author.id}>`)
          .then(message => message.delete());
        var e = new Discord.MessageEmbed()
          .setColor("BLACK")
          .setDescription(`Bu Sunucuda Everyone ve Here Yasak!`);
        msg.channel.send(e);
      }
    }
  } else if (hereengelle == "kapali") {
  }
});

// ekledim atıldım

client.on('guildDelete', guild => {

let thorcuk = new Discord.MessageEmbed()

.setColor("RED")
.setTitle(" Bot Kickledi ")
.addField("Sunucu Adı:", guild.name)
.addField("Sunucu sahibi", guild.owner)
.addField("Sunucu Sahibi'nin ID'si", guild.ownerID)
.addField("Sunucunun Kurulu Olduğu Bölge:", guild.region)
.addField("Sunucudaki Kişi Sayısı:", guild.memberCount)

   client.channels.cache.get('781134742677618759').send(thorcuk);

});


client.on('guildCreate', guild => {

let thorcuk = new Discord.MessageEmbed()

.setColor("GREEN")
.setTitle(" Bot Eklendi ")
.addField("Sunucu Adı:", guild.name)
.addField("Sunucu sahibi", guild.owner)
.addField("Sunucu Sahibi'nin ID'si", guild.ownerID)
.addField("Sunucunun Kurulu Olduğu Bölge:", guild.region)
.addField("Sunucudaki Kişi Sayısı:", guild.memberCount)

   client.channels.cache.get('781134553179357194').send(thorcuk);

});

// mod log

const botadi = "Starus"


client.on('guildBanAdd', async (guild, user) => {
  let modlogs = db.get(`modlogkanaly_${guild.id}`)
  const modlogkanal = guild.channels.find(kanal => kanal.id === modlogs);
  if(!modlogs) return;
  if(modlogs) {
    let embed = new Discord.MessageEmbed()
    .setColor("#fffa00")
    .setAuthor("Bir kişi sunucudan yasaklandı")
    .setThumbnail(user.avatarURL||user.defaultAvatarURL)
    .addField(`Yasaklanan kişi`, `\`\`\` ${user.tag} \`\`\` `)
    .setFooter(`${botadi} | Mod-Log Sistemi`)
    .setTimestamp()
    modlogkanal.send(embed)
  }
});


client.on('guildBanRemove', async (guild, user) => {
 let modlogs = db.get(`modlogkanaly_${guild.id}`)
  const modlogkanal = guild.channels.find(kanal => kanal.id === modlogs);
  if(!modlogs) return;
  if(modlogs) {
    let embed = new Discord.MessageEmbed()
    .setColor("#fffa00")
    .setAuthor("Bir kişinin yasağı kaldırıldı")
    .setThumbnail(user.avatarURL||user.defaultAvatarURL)
    .addField(`Yasağı kaldırılan kişi`, `\`\`\` ${user.tag} \`\`\` `)
    .setFooter(`${botadi} | Mod-Log Sistemi`)
    .setTimestamp()
    modlogkanal.send(embed)
  }
});


client.on('channelCreate', async channel => {
 let modlogs = db.get(`modlogkanaly_${channel.guild.id}`)
 let entry = await channel.guild.fetchAuditLogs({type: 'CHANNEL_CREATE'}).then(audit => audit.entries.first())
 let user = client.users.cache.get(entry.executor.id)
  const modlogkanal = channel.guild.channels.cache.find(kanal => kanal.id === modlogs);
  if(!modlogs) return;
  if(modlogs) {
    if (channel.type === "text") {
      let embed = new Discord.MessageEmbed()
      .setColor("#fffa00")
      .setAuthor("Bir Kanal Oluşturuldu")
      .addField(`Oluşturulan Kanalın İsmi : `, `${channel.name}`)
      .addField(`Oluşturulan Kanalın Türü : `, `Yazı`)
      .addField(`Kanalı Oluşturan : `, `<@${user.id}>`)
      .setFooter(`${botadi} | Mod-Log Sistemi`)
      .setTimestamp()
      modlogkanal.send(embed)
    }
      if (channel.type === "voice") {
      
        let embed = new Discord.MessageEmbed()
        .setColor("#fffa00")
        .setAuthor("Bir Kanal Oluşturuldu")
        .addField(`Oluşturulan Kanalın İsmi : `, `${channel.name}`)
        .addField(`Oluşturulan Kanalın Türü : `, `Ses`)
        .addField(`Kanalı Oluşturan : `, `<@${user.id}>`)
        .setFooter(`${botadi} | Mod-Log Sistemi`)
        .setTimestamp()
        modlogkanal.send(embed)


    }
}});

client.on('channelDelete', async channel => {
      let entry = await channel.guild.fetchAuditLogs({type: 'CHANNEL_DELETE'}).then(audit => audit.entries.first())
  let user = client.users.cache.get(entry.executor.id)
 let modlogs = db.get(`modlogkanaly_${channel.guild.id}`)
  const modlogkanal = channel.guild.channels.cache.find(kanal => kanal.id === modlogs);
  if(!modlogs) return;
  if(modlogs) {
    if (channel.type === "text") {
    let embed = new Discord.MessageEmbed()
    .setColor("#fffa00")
    .setAuthor("Bir Kanal Silindi")
    .addField(`Silinen Kanalın İsmi : `, `${channel.name}`)
    .addField(`Silinen Kanalın Türü : `, `Yazı`)
    .addField(`Kanalı Silen : `, `<@${user.id}>`)
    .setFooter(`${botadi} | Mod-Log Sistemi`)
    .setTimestamp()
    modlogkanal.send(embed)
  }
      if (channel.type === "voice") {

        let embed = new Discord.MessageEmbed()
        .setColor("#fffa00")
        .setAuthor("Bir Kanal Silindi")
        .addField(`Silinen Kanalın İsmi : `, `${channel.name}`)
        .addField(`Silinen Kanalın Türü : `, `Ses`)
        .addField(`Kanalı Silen : `, `<@${user.id}>`)
        .setFooter(`${botadi} | Mod-Log Sistemi`)
        .setTimestamp()
        modlogkanal.send(embed)
       }
      }
    });

client.on('roleDelete', async role => {
 let modlogs =  db.get(`modlogkanaly_${role.guild.id}`)
  let entry = await role.guild.fetchAuditLogs({type: 'ROLE_DELETE'}).then(audit => audit.entries.first())
  let user = client.users.cache.get(entry.executor.id)
 const modlogkanal = role.guild.channels.cache.find(kanal => kanal.id === modlogs);
  if(!modlogs) return;
  if(modlogs) {
    let embed = new Discord.MessageEmbed()
    .setColor("#fffa00")
    .setAuthor("Bir Rol Silindi")
    .addField(`Silinen Rolün İsmi : `, `${role.name}`)
    .addField(`Rolü Silen : `, `<@${user.id}>`)
    .setFooter(`${botadi} | Mod-Log Sistemi`)
    .setTimestamp()
    modlogkanal.send(embed)
  }
});

client.on('emojiDelete', async emoji => {
 let modlogs = db.get(`modlogkanaly_${emoji.guild.id}`)
 let entry = await emoji.guild.fetchAuditLogs({type: 'EMOJI_DELETE'}).then(audit => audit.entries.first())
 let user = client.users.cache.get(entry.executor.id)
  const modlogkanal = emoji.guild.channels.cache.find(kanal => kanal.id === modlogs);
  if(!modlogs) return;
  if(modlogs) {
    let embed = new Discord.MessageEmbed()
    .setColor("#fffa00")
    .setAuthor("Bir Emoji Silindi")
    .addField(`Silinen Emojinin İsmi : `, `${emoji.name}`)
    .addField(`Emojiyi Silen : `, `<@${user.id}>`)
    .setFooter(`${botadi} | Mod-Log Sistemi`)
    .setTimestamp()
    modlogkanal.send(embed)
  }
});
  

client.on('roleCreate', async role => {
let modlogs =  db.get(`modlogkanaly_${role.guild.id}`)
let entry = await role.guild.fetchAuditLogs({type: 'ROLE_CREATE'}).then(audit => audit.entries.first())
let user = client.users.cache.get(entry.executor.id)
  const modlogkanal = role.guild.channels.cache.find(kanal => kanal.id === modlogs);
  if(!modlogs) return;
  if(modlogs) {
    let embed = new Discord.MessageEmbed()
    .setColor("#fffa00")
    .setAuthor("Bir Rol Oluşturuldu")
    .addField(`Oluşturulan Rolün İsmi : `, `${role.name}`)
    .addField(`Rolü Oluşturan : `, `<@${user.id}>`)
    .setFooter(`${botadi} | Mod-Log Sistemi`)
    .setTimestamp()
    modlogkanal.send(embed)
  }
});


client.on('emojiCreate', async emoji => {
 let modlogs = db.get(`modlogkanaly_${emoji.guild.id}`)
 let entry = await emoji.guild.fetchAuditLogs({type: 'EMOJI_CREATE'}).then(audit => audit.entries.first())
 let user = client.users.cache.get(entry.executor.id)
  const modlogkanal = emoji.guild.channels.cache.find(kanal => kanal.id === modlogs);
  if(!modlogs) return;
  if(modlogs) {
    let embed = new Discord.MessageEmbed()
    .setColor("#fffa00")
    .setAuthor("Bir Emoji Oluşturuldu")
    .addField(`Oluşturulan Emojinin İsmi : `, `${emoji.name}`)
    .addField(`Emoji Silen : `, `<@${user.id}>`)
    .setFooter(`${botadi} | Mod-Log Sistemi`)
    .setTimestamp()
    modlogkanal.send(embed)
  }
});

  //MESAJ LOG

client.on("messageUpdate", async (oldMessage, newMessage) => {
  if (newMessage.author.bot || newMessage.channel.type === "dm") return;
  if (newMessage.content.startsWith(newMessage)) return;
  let sc = await db.fetch(`modlogkanaly_${newMessage.guild.id}`);
  let scbul = newMessage.guild.channels.cache.get(sc)
  if(!scbul) {
    
  }
  if (oldMessage.content == newMessage.content) return;
  let embed = new Discord.MessageEmbed()
    .setColor("#fffa00")
    .setAuthor(`Mesaj Düzenlendi`, newMessage.author.avatarURL)
    .addField("Kullanıcı", newMessage.author)
    .addField("Eski Mesaj", "```" + oldMessage.content + "```")
    .addField("Yeni Mesaj", "```" + newMessage.content + "```")
    .addField("Kanal Adı", newMessage.channel.name)
    .addField("Mesaj ID", newMessage.id)
    .addField("Kullanıcı ID", newMessage.author.id)
    .setFooter(`Bilgilendirme  • bügün saat ${newMessage.createdAt.getHours() +
        3}:${newMessage.createdAt.getMinutes()}`
    );
  scbul.send(embed);
});

client.on("messageDelete", async deletedMessage => {
  if (deletedMessage.author.bot || deletedMessage.channel.type === "dm") return;
  if (deletedMessage.content.startsWith (deletedMessage)) return;
  let sc = await db.fetch(`modlogkanaly_${deletedMessage.guild.id}`);
  let scbul = deletedMessage.guild.channels.cache.get(sc)
  if(!scbul) {
    
  }
  let embed = new Discord.MessageEmbed()
    .setColor("#fffa00")
    .setAuthor(`Mesaj Silindi`, deletedMessage.author.avatarURL)
    .addField("Kullanıcı", deletedMessage.author)
    .addField("Silinen Mesaj", "```" + deletedMessage.content + "```")
    .addField("Kanal Adı", deletedMessage.channel.name)
    .addField("Mesaj ID", deletedMessage.id)
    .addField("Kullanıcı ID", deletedMessage.author.id)
    .setFooter(`Bilgilendirme  • bügün saat ${deletedMessage.createdAt.getHours() +
        3}:${deletedMessage.createdAt.getMinutes()}`
    );
  scbul.send(embed);
});

// kanal koruma 

client.on("channelDelete", async function(channel) {
    let rol = await db.fetch(`kanalk_${channel.guild.id}`);
  
  if (rol) {
const guild = channel.guild.cache;
let channelp = channel.parentID;

  channel.clone().then(z => {
    let kanal = z.guild.channels.find(c => c.name === z.name);
    kanal.setParent(
      kanal.guild.channels.find(channel => channel.id === channelp)
      
    );
  });
  }
})


// etiket prefix

client.on('message', async msg => {
  let prefix = await db.fetch(`prefix.${msg.guild.id}`) || ayarlar.prefix 
  if(msg.content == `<@!744990839339483276>`) return msg.channel.send(`> **Starus | Prefix**\n\n> <a:hypee:764427448569036812> **Sanırım beni etiketlediniz.**\n > <a:hypee:764427448569036812> Buyurun prefixim \`${prefix}\``);
});

// prefix değişdirme

client.on("message", async message => {

  if (message.author.bot) return;

  if (!message.guild) return;

  let prefix = db.get(`prefix_${message.guild.id}`);

  if (prefix === null) prefix = prefix;

  if (!message.content.startsWith(prefix)) return;

  if (!message.member)

  message.member = await message.guild.fetchMember(message);

  const args = message.content

    .slice(prefix.length)

    .trim()

    .split(/ +/g);

  const cmd = args.shift().toLowerCase();

  if (cmd.length === 0) return;
  
  let command = client.commands.get(cmd);

  if (!command) command = client.commands.get(client.aliases.get(cmd));

  if (command) command.run(client, message, args);

});



// ototag sistemi

client.on("guildMemberAdd", async member => {
let ototag = await db.fetch(`judgeteam?Ototag_${member.guild.id}`) 
let ototagkanal = await db.fetch(`judgeteam?OtotagKanal_${member.guild.id}`)
if(!ototag|| !ototagkanal) return
 
 member.setNickname(`${ototag} ${member.user.username}`)
client.channels.cache.get(ototagkanal).send(`**${member.user.username}** Adlı Kullanıcıya Otomatik Tag Verildi! :inbox_tray:`)
 
});

// sayaç sistemi

client.on("guildMemberAdd", async member => {
  const kanal = await db.fetch(`sayacK_${member.guild.id}`);
  if (!kanal) return;
  const sayaç = await db.fetch(`sayacS_${member.guild.id}`);
    const sonuç = sayaç - member.guild.memberCount;
  const mesaj = await db.fetch(`sayacHG_${member.guild.id}`)
    ///....

  ///....
  if (!mesaj) {
    return client.channels.cache.get(kanal).send("<a:giri:766062539745394759> `"+ member.user.username + "`**Adlı Kullanıcı Aramıza Katıldı!** `" + sayaç + "` **Kişi Olmamıza** `" + sonuç + "` **Kişi Kaldı.** `" + member.guild.memberCount + "` **Kişiyiz!**");
  }

  if (member.guild.memberCount == sayaç) {
    return client.channels.get(kanal).send(`<a:onaylamak:761318247122993173> **Sayaç Sıfırlandı!** \`${member.guild.memberCount}\` **Kişiyiz!**`)
    await db.delete(`sayacK_${member.guild.id}`)
    await db.delete(`sayacS_${member.guild.id}`)
    await db.delete(`sayacHG_${member.guild.id}`)
    await db.delete(`sayacBB_${member.guild.id}`)
  }
  if (mesaj) {
    const mesaj31 = mesaj.replace("-uyetag-", `${member.user.tag}`).replace("-server-", `${member.guild.name}`).replace("-uyesayisi-", `${member.guild.memberCount}`).replace("-botsayisi-", `${member.guild.members.filter(m => m.user.bot).size}`).replace("-bolge-", `${member.guild.region}`).replace("-kanalsayisi-", `${member.guild.channels.size}`).replace("-kalanuye-", `${sonuç}`).replace("-hedefuye-", `${sayaç}`)
    return client.channels.cache.get(kanal).send(mesaj31);
    
  }
});

client.on("guildMemberRemove", async member => {

  const kanal = await db.fetch(`sayacK_${member.guild.id}`);
  const sayaç = await db.fetch(`sayacS_${member.guild.id}`);
  const sonuç = sayaç - member.guild.memberCount;
  const mesaj = await db.fetch(`sayacBB_${member.guild.id}`)
  if (!kanal) return;
  if (!sayaç) return;
    ///....

  if (!mesaj) {
    return client.channels.cache.get(kanal).send("<a:k_:766062527623987211> `" + member.user.username + "` **Adlı Kullanıcı Aramızdan Ayrıldı.**`" + sayaç + "` **Kişi Olmamıza** `" + sonuç + "` **Kişi Kaldı.** `" + member.guild.memberCount + "` **Kişiyiz!**");
      }

  if (mesaj) {
    const mesaj31 = mesaj.replace("-uye-", `${member.user.tag}`).replace("-server-", `${member.guild.name}`).replace("-uyesayisi-", `${member.guild.memberCount}`).replace("-botsayisi-", `${member.guild.members.filter(m => m.user.bot).size}`).replace("-bolge-", `${member.guild.region}`).replace("-kanalsayisi-", `${member.guild.channels.cache.size}`).replace("-kalanuye-", `${sonuç}`).replace("-hedefuye-", `${sayaç}`)
    return client.channels.cache.get(kanal).send(mesaj31);
  }
});


// özel sistem

client.on("message", async msg => {
  
  
 const i = await db.fetch(`starus_${msg.guild.id}`)
    if (i == "acik") {
        const starus = ["4 5 6 sc isteyen dm","4 5 6 scrim isteyen dm","sc isteyen dm","scrim isteyen dm","4 5 6 scrim bilen dm","9 10 11 scrim bilen dm","8 9 10 scrim bilen dm","8 9 10 sc bilen dm","scrim isteyen","scrim bilen","4 5 6 scrim bilen","scrim isten dm","sc isten dm"];
        if (starus.some(word => msg.content.includes(word))) {
          try {
            if (!msg.member.hasPermission("BAN_MEMBERS")) {
                  msg.delete();
                          
                      return msg.reply('Bu sunucuda scrim reklamı yapamazsın.')
            }              
          } catch(err) {
            console.log(err);
          }
        }
    }
    if (!i) return;
});

client.on("messageUpdate", (oldMessage, newMessage) => {
  
  
 const i = db.fetch(`${oldMessage.guild.id}.starus`)
    if (i) {
        const starus = ["4 5 6 sc isteyen dm","4 5 6 scrim isteyen dm","sc isteyen dm","scrim isteyen dm","4 5 6 scrim bilen dm","9 10 11 scrim bilen dm","8 9 10 scrim bilen dm","8 9 10 sc bilen dm","scrim isteyen","scrim bilen","4 5 6 scrim bilen","scrim isten dm","sc isten dm"];
        if (starus.some(word => newMessage.content.includes(word))) {
          try {
            if (!oldMessage.member.hasPermission("BAN_MEMBERS")) {
                  oldMessage.delete();
                          
                      return oldMessage.reply('Bu sunucuda scrim reklamı yapamazsın.')
            }              
          } catch(err) {
            console.log(err);
          }
        }
    }
    if (!i) return;
});

// çekiliş sistemi

client.on('ready', async () => {
  
      function destructMS(milli) {
        if (isNaN(milli) || milli < 0) {
          return null;
        }
      
        var d, h, m, s;
        s = Math.floor(milli / 1000);
        m = Math.floor(s / 60);
        s = s % 60;
        h = Math.floor(m / 60);
        m = m % 60;
        d = Math.floor(h / 24);
        h = h % 24;
        var yazi;
        if (d !== 0) yazi = `${d} gün`;
        if (h !== 0 && yazi) yazi = yazi + `, ${h} saat`;
        if (h !== 0 && !yazi) yazi = `${h} saat`;
        if (m !== 0 && yazi) yazi = yazi + `, ${m} dakika`;
        if (m !== 0 && !yazi) yazi = `${m} dakika`;
        if (s !== 0 && yazi) yazi = yazi + `, ${s} saniye`;
        if (s !== 0 && !yazi) yazi = `${s} saniye`;
        if (yazi) return yazi;
        if (!yazi) return `1 saniye`;
      };
  
      function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
}
  
      function cekme(message, array) {
      var eskikazananlar = db.fetch(`cekilis_${message.id}.kazananlar`) || []
      var cekilenkisi = array[Math.floor(Math.random() * array.length)]
      if (!client.users.cache.get(cekilenkisi.id)) {
        return cekme(message, array)
      }
      while (eskikazananlar.includes(cekilenkisi.id)) {
        return cekme(message, array)
      }
      if (!eskikazananlar.includes(cekilenkisi.id)) {
        if (db.has(`cekilis_${message.id}.kazananlar`)) {
          db.push(`cekilis_${message.id}.kazananlar`, cekilenkisi.id)
        }else{
          db.set(`cekilis_${message.id}.kazananlar`, [cekilenkisi.id])
        }
      }
    }
  
  let dasall = db.all().filter(i => i.ID.startsWith('cekilis_'))
  for (const ii of dasall) {
    const channel = client.channels.cache.get(db.fetch(`${ii.ID}.mesaj.kanal`))
    const mesaj = db.fetch(`${ii.ID}.mesaj.id`)
    const bitecegizamanms = db.fetch(`${ii.ID}.bitecek`)
    const kazanacak = db.fetch(`${ii.ID}.kazanacak`)
    const verilecek = db.fetch(`${ii.ID}.verilecek`)
    const cekilisid = db.fetch(`${ii.ID}.cekilisid`)
    let embed = new Discord.MessageEmbed()
    .setAuthor('🎉 Çekiliş 🎉')
    .setTitle('**' + verilecek + '**')
    .setDescription(`Aşağıdaki 🎉 emojisine tıklayarak çekilişe katılabilirsiniz!\n**Kalan süre:** Bekleniyor...`)
    .setFooter(`${kazanacak} kazanan | ID: ${cekilisid} | Bitecek:`)
    .setTimestamp(bitecegizamanms)
    .setColor("#2F3136")
    if(channel) {
channel.messages.fetch(mesaj).then(async msg => {
  msg.edit(embed)
  const reaction = msg.reactions.cache.first()
                const intervaley = setInterval(async function(){
                if (!db.has(ii.ID)) return clearInterval(intervaley)
                const kalanzaman = bitecegizamanms - Date.now()   
                if (kalanzaman <= 0) {
                  embed.setDescription(`Çekiliyor...`)
                  msg.edit(embed)
                  clearInterval(intervaley)
                  reaction.users.fetch().then(async kasiler => {
                    const gercekkisisayisi = kasiler.size - 1
                    if (gercekkisisayisi < kazanacak) {
                        let embed = new Discord.MessageEmbed()
                        .setAuthor('🎉 Çekiliş Bitti 🎉')
                        .setTitle('**' + verilecek + '**')
                        .setDescription(`Yeterli katılım olmadığından kazanan seçilemedi.`)
                        .setFooter(`${kazanacak} kazanan | Çekiliş Başlatıldı | Çekiliş ID: ${cekilisid} | Bitti:`)
                        .setTimestamp(bitecegizamanms)
                        .setColor("#2F3136")
                        msg.edit(embed)
                        msg.reactions.removeAll()
                        db.delete(`cekilis_${msg.id}`)
                        let thall = db.all().filter(i => i.ID.includes(msg.id))
                        for (const uu of thall) {
                          db.delete(uu.ID)
                        }
                    }else{
                        var array = reaction.users.cache.array()
                        var ukuk;
                        for (ukuk = 0; ukuk < kazanacak; ukuk++) {
                          cekme(msg, array)
                        }
                      await sleep(50)
                        let kazananherkes = db.fetch(`cekilis_${msg.id}.kazananlar`)
                            let embed = new Discord.MessageEmbed()
                            .setAuthor('🎉 Çekiliş Bitti 🎉')
                            .setTitle('**' + verilecek + '**')
                            .setDescription(`**Kazananlar:** <@${kazananherkes.join('>, <@')}>`)
                            .setFooter(`${kazanacak} kazanan | Çekiliş Başlatıldı |Çekiliş ID: ${cekilisid} | Bitti:`)
                            .setTimestamp(bitecegizamanms)
                            .setColor("#2F3136")
                            msg.edit(embed)
                            msg.channel.send(`**Tebrikler** <@${kazananherkes.join('>, <@')}>! **\`${verilecek}\` çekilişini kazandınız!**`)
                            db.set(`cekilisidsi_${cekilisid}.kazananlar`, kazananherkes)
                            db.delete(`cekilis_${msg.id}`)
                            let theall = db.all().filter(i => i.ID.includes(msg.id))
                            for (const ua of theall) {
                              db.delete(ua.ID)
                            }
                    }
                  })
                }else{
                const kalanzamanyazi = destructMS(kalanzaman)
                embed.setDescription(`Aşağıdaki 🎉 emojisine tıklayarak çekilişe katılabilirsiniz!\n**Kalan süre:** ${kalanzamanyazi}`)
                msg.edit(embed)
                }
            }, 5000)
         })
    }
  }
})

