const { Message, DiscordAPIError } = require("discord.js")
const { Client, MessageEmbed } = require('discord.js')
const { PerformanceObserver, performance } = require('perf_hooks');
const fs = require('fs');
const { Menu } = require('discord.js-menu')
const answers = require('./src/answers.json')
const aliases = require('./src/aliases.json')
const iPP = 10; //items per page

var index = [];
var indexAlias = [];

for (var x in answers) {
    index.push(x);
}
for (var x in aliases) {
    indexAlias.push(x);
}

let helpDesc = ""
for (i = 1; i < index.length + 1; i++) {
    helpDesc = helpDesc + `**${i})** ${index[i - 1].charAt(0).toUpperCase() + index[i - 1].slice(1)} *(${answers[index[i - 1]].length} défis)* \n`
}
const helpMsg = {
    embed: {
        color: 3447003,
        title: "Catégories disponibles",
        description: helpDesc
    }
};


function toAlias(string) {
    for (i = 0; i < indexAlias.length; i++) {
        if (aliases[indexAlias[i]].find(alias => alias === string)) return indexAlias[i];
    }
    return false;
}

module.exports = {
    name: 'mdefi',
    description: '',
    async execute(message, args) {
        if (!message.member.roles.cache.has('481039489641480192')) return message.channel.send("⛔ Tu n'as pas la permission de faire cette commande ⛔");
        let pageArray = []
        if (!args[0]) return message.channel.send(helpMsg);
        args[0] = args[0].replace(new RegExp(/[èéêë]/g), "e");
        if (!isNaN(args[0]) && answers[index[args[0] - 1]]) args[0] = index[args[0] - 1];
        args[0] = args[0].toLowerCase();
        if (!answers[args[0]]) args[0] = toAlias(args[0]);
        if (!answers[args[0]]) return message.channel.send(helpMsg);
        if (!args[1]) {
            try {
                for (i = 1; i < Math.ceil(answers[args[0]].length / iPP) + 1; i++) {
                    let tempArray = ""
                    for (x = 0; x < answers[args[0]].slice((i - 1) * iPP, i * iPP).length; x++) {
                        tempArray = tempArray + `**${(i - 1) * iPP + x + 1})** ` + (answers[args[0]].slice((i - 1) * iPP, i * iPP)[x].charAt(0).toUpperCase() + (answers[args[0]].slice((i - 1) * iPP, i * iPP)[x].slice(1))) + "\n"
                    };
                    pageArray.push({
                        name: `${i}`,
                        content: new MessageEmbed({
                            color: '#ff0000',
                            title: `Page ${i} sur ${Math.ceil(answers[args[0]].length / iPP)}`,
                            fields: [
                                {
                                    name: `Liste de défis (${args[0].charAt(0).toUpperCase() + args[0].slice(1)})`,
                                    value: `${tempArray}`,
                                    inline: true
                                }
                            ]
                        }),
                        reactions: {
                            '◀️': 'previous',
                            '▶️': 'next',
                            '🗑️': 'delete'
                        }
                    });
                    //message.channel.send(`${answers[args[0]].slice((args[1] - 1) * 5, args[1] * 5)}`);
                }
                //console.log(pageArray)
                let helpMenu = new Menu(message.channel, message.author.id, pageArray, 30000);
                helpMenu.start()
                helpMenu.on('pageChange', destination => {
                })
            }
            catch {
                message.channel.send("Erreur lors de la requête");
                return;
            }
            return;
        }
        if (args[1] == "add") {
            message.channel.send(index)
            message.channel.send(answers[args[0]])
        }
    }
}