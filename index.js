const Discord = require('discord.js');
const GiphyAPIClient = require('giphy-js-sdk-core');
const client = new Discord.Client();
const {prefix, token, giphy_api_key} = require('./config.json');
const fs = require('fs');

let giphy = GiphyAPIClient(giphy_api_key);
let availableGifs = [];
let totalResponses = 0;

let regulateDes = "**regulate:** Prints a Leslie Nielsen Gif";
let croDes = "**cro:** Ask the bot a question";
let fundsDes = "**funds:** Prints current shared Regulator funds";
let setFundsDes = "**setfunds:** Sets current funds in gold only, ex: !setfunds 1337";
let helpDes = "**helpme:** prints this..duh";

let regulators = [
    'Broz',
    'Shmendrick',
    'Adolin',
    'Liam',
    'Blitz',
    'Anomander',
    'Crawford'
];

module.exports = {
    name: "help",
    aliases: ["h"],
    category: "info",
    description: "Returns all commands or one specific command info",
    usuage: "[command | alias]",
    run: async (client, message, args) => {

    }
}

client.once('ready', () => {
    console.log('Ready!');
    client.user.setActivity("What is a man's life worth?");
    giphy.search('gifs',{"q": "leslie nielsen"}).then((response) => {
        availableGifs = response.data;
        totalResponses = availableGifs.length;
        //console.log(availableGifs);
    });
});

client.login(token);

client.on('message', message => {
    if (message.content.startsWith(`${prefix}regulate`)) {
        console.log('Regulate!');
        runRegulate(message);
    }
    if (message.content.startsWith(`${prefix}funds`)) {
        console.log('Funds');
        runGetFunds(message);
    }
    if (message.content.startsWith(`${prefix}setfunds`)) {
        console.log('Set Funds');
        let args = message.content.slice(`${prefix}setfunds`).split(' ');
        console.log(args);
        if(typeof args[1] === 'undefined') {
            message.channel.send('error');
        }
        else {
            runSetFunds(message, args[1]);
        }
    }
    if (message.content.startsWith(`${prefix}cro`) || message.content.startsWith(`${prefix}robocro`)) {
        let responses = [
            'For this, let\'s go with what [r] said',
            'I\'m going to side with [r] on this one',
            'I think [r] is right',
            'Leaning towards [r]',
            '[r] is right this time',
            '[r] makes a lot of sense here',
            '#team[r]',
        ];
        let response = responses[Math.floor(Math.random()*responses.length)];
        let regulator = regulators[Math.floor(Math.random()*regulators.length)];
        response = response.replace('[r]',regulator);

        message.channel.send(response);
    }
    if (message.content.startsWith(`${prefix}helpme`)) {
        runHelp(message);
    }
});

function runRegulate(message){
    message.react('☠');
    if(totalResponses > 0){
        let gifIndex = Math.floor((Math.random() * 10) + 1) % totalResponses;
        let gif = availableGifs[gifIndex];
        /*message.channel.send('R E G U L A T O R S',{
            files: [gif.images.fixed_height.url]
        })*/
        message.channel.send(gif.images.fixed_height.url)
            .then(function(message){
                //message.react('☠');
            }).catch(function(){
                console.log('error');
            });
    }else{
        console.log('Error');
    }
}

function runGetFunds(message){
    message.react('💰');
    let gold = 0;
    fs.readFile('data/funds', "utf8", function(err, data) {
        console.log(err);
        console.log(data);
        gold = data;
        message.channel.send('The Regulators hold a big bag of ' + gold + ' gold');
    });
}

function runSetFunds(message, newFunds){
    if(isNaN(newFunds)){
        message.channel.send('Not a number');
    }else{
        fs.writeFile('data/funds', newFunds, function(err) {
            if (err) throw err;
            console.log('New funds have been set!');
            message.channel.send('New funds have been set');
        });
    }
}


function runHelp(message){

    message.channel.send(`${regulateDes} \n${croDes} \n${fundsDes} \n${setFundsDes} \n${helpDes} \n`);
}

