const Discord = require('discord.js');
const fs = require('fs');
const cron = require('cron');
const client = new Discord.Client();
const prefix = '-';

client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command)
}

client.once('ready', () => {
    console.log('Arrobot is ready !');
    client.user.setPresence({
        status: 'online',
        activity: {
            name: `Un jeu de fou`,
            type: 'STREAMING',
            url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        }
    });
    var d = new Date();
console.log(d.toLocaleTimeString());
});
let scheduledMessage = new cron.CronJob('03 00 17 * * *', () => {
    // This runs every day at 10:30:00, you can do anything you want
    let guild = client.guilds.cache.get('340083769631571968');
    if(guild && guild.channels.cache.get('477498959175221268')){
        guild.channels.cache.get('477498959175221268').send("[**RAPPEL**] Si vous manquez d'imagination pour vos défis de rêve lucide, vous pouvez utiliser la commande **-defi**")
        guild.channels.cache.get('477498959175221268').send("-defi liste")
    }
  });
  let annonceDjazz = new cron.CronJob('03 0 17 ? * TUE,SAT', () => {
    // This runs every day at 10:30:00, you can do anything you want
    let guild = client.guilds.cache.get('340083769631571968');
    if(guild && guild.channels.cache.get('452416989617586176')){
        guild.channels.cache.get('452416989617586176').send(`[**RAPPEL**] Si vous êtes en perte de motivation et que vous avez besoin d'un ptit coup de pied au c** pour vous remettre dans l'bain, ça se passe ici <#${816713658750992433}> (voir le message épinglé pour l'accès au chat)`)
    }
  });
  annonceDjazz.start();
  scheduledMessage.start();
client.on('message', message => {
    if (!message.content.startsWith(prefix) /*|| message.author.bot*/) return;
    if (message.channel.type == "dm") return;
    const args = message.content.slice(prefix.length).split(/ +/);
    let command = args.shift().toLowerCase();
    command = command.replace(new RegExp(/[èéêë]/g),"e");

    if (command === 'defi') {
        client.commands.get('defi').execute(message, args);
    }
    if (command === 'mdefi') {
        client.commands.get('mdefi').execute(message, args);
    }
    if (command === 'preview') {
        message.channel.send(`[**RAPPEL**] Si vous êtes en perte de motivation et que vous avez besoin d'un ptit coup de pied au c** pour vous remettre dans l'bain, ça se passe ici <#${816713658750992433}> (voir le message épinglé pour l'accès au chat)`)
    }
    
})
client.login(process.env.TOKEN)
