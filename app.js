const Discord = require('discord.js');
const client = new Discord.Client();
const cheerio = require('cheerio');
const rp = require('request-promise');

const config = require('./config.json');

client.on('message', (message) => {
    if (!message.content.startsWith(config.COMMAND_PREFIX) || message.author.bot) return;

    const args = message.content.slice(config.COMMAND_PREFIX.length).trim().split(' ');

    const command = args.shift().toLowerCase();

    if (command == 'teams') {
        if (!args.length) {
            return message.channel.send(`${config.COMMAND_PREFIX}teams {prénom.nom}, ${message.author}!`);
        } else if (args.length == 1) {
            let planningUrl = config.PLANNING_URL;

            const today = new Date();
            const todayString = (today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear();

            planningUrl = planningUrl.replace('{USERNAME}', args[0]).replace('{DATE}', todayString);

            console.log(planningUrl)
            rp(planningUrl)
                .then(res => {
                    const teamsUrl = cheerio('.Teams > a', res)[0].attribs.href;
                    message.reply(`voici le lien de ton cours -> ${teamsUrl}`);
                })
        }
    }
});

client.login(config.BOT_TOKEN)