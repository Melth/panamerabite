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
});
let scheduledMessage = new cron.CronJob('00 50 01 * * *', () => {
    // This runs every day at 10:30:00, you can do anything you want
    let guild = client.guilds.cache.get('505605707693948928');
    if(guild && guild.channels.cache.get('505605707693948930')){
        guild.channels.cache.get('505605707693948930').send("[**RAPPEL**] Si vous manquez d'imagination pour vos défis de rêve lucide, vous pouvez utiliser la commande **-defi**")
        guild.channels.cache.get('505605707693948930').send("-defi liste")
    }
  });
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
})
client.login(process.env.TOKEN)
