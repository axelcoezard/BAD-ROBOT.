import Discord from "discord.js"
import Dotenv from "dotenv"

import Config from "./config"

const Client = new Discord.Client();

const State = {
    audioConnection: null,
    audioDispatcher: null,
    audioPlaying: false,
    audioVolume: 50,
    audioQueue: []
};

Dotenv.config();

Client.on("message", (message) => {
    const {content} = message;

    if(message.author.bot) return;
    if (!message.content.startsWith(Config.prefix)) return;

    const cmd_args = content.split(" ");
    const cmd = cmd_args.shift().substr(Config.prefix.length).toLowerCase();

    try {
        const command = require(`./commands/${cmd}.js`);
        command.default(Client, message, cmd_args, State)
    } catch (e) {
        console.log(e.stack)
    }
})

Client.on("ready", () => {
    console.log("[BOT] Waiting for instructions")
})

Client.login(process.env.TOKEN).catch(e => console.log(e));