const Discord = require('discord.js');
const fs = require('fs');
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

client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;
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