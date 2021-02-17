const { Message, DiscordAPIError } = require("discord.js")
const answers = require('./src/answers.json')
const aliases = require('./src/aliases.json')

Array.prototype.random = function () {
    return this[Math.floor((Math.random() * this.length))];
}

var index = [];
var indexAlias = [];

// build the index
for (var x in answers) {
    index.push(x);
}
for (var x in aliases) {
    indexAlias.push(x);
}
function toAlias(string) {
    for (i = 0; i < indexAlias.length; i++) {
        if (aliases[indexAlias[i]].find(alias => alias === string)) return indexAlias[i];
    }
    return false;
}

let helpDesc = ""
for (i = 1; i < index.length + 1; i++) {
    helpDesc = helpDesc + `**${i})** ${index[i - 1].charAt(0).toUpperCase() + index[i - 1].slice(1)} *(${answers[index[i - 1]].length} défis)* \n`
}
helpDesc = helpDesc + "\n**99)** Aléatoire *(Par défaut)*";
const helpMsg = {
    embed: {
        color: 3447003,
        title: "Catégories disponibles",
        description: helpDesc,
        fields: [
            {
                name: "\nInstructions pour utiliser la commande",
                value: "```-défi <nombre ou nom de la catégorie>```"
            }
        ]
    }
};

module.exports = {
    name: 'defi',
    description: '',
    async execute(message, args) {
        if (!args[0]) args[0] = "aleatoire";
        let argBuild = ""
        if (args.length > 1) {
            for (i = 0; i < args.length; i++) {
                argBuild = argBuild + args[i] + ' '
            }
            argBuild = argBuild.slice(0,-1)
        }
        else{
            argBuild = args[0];
        };
        argBuild = argBuild.replace(new RegExp(/[èéêë]/g), "e");
        argBuild = argBuild.toLowerCase();
        //message.channel.send(argBuild);
        if (argBuild === "aleatoire" || argBuild === "99") {
            return message.channel.send(`<@${message.author.id}>, dans ton prochain RL, tu devras ${answers[index.random()].random()} \nBonne chance !`);
        }
        if (!isNaN(argBuild) && answers[index[argBuild - 1]]) argBuild = index[argBuild - 1];
        if (!answers[argBuild]) argBuild = toAlias(argBuild);
        if (!answers[argBuild]) return message.channel.send(helpMsg);
        message.channel.send(`<@${message.author.id}>, dans ton prochain RL, tu devras ${answers[argBuild].random()} \nBonne chance !`)
    }
}