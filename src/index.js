import Discord from "discord.js"
import Dotenv from "dotenv"

import Config from "./config"

const Client = new Discord.Client();

const State = {
    audioVolume: 50,
    audioQueue: []
}

Dotenv.config();

Client.on("ready", () => {
    console.log("[BOT] Waiting for instructions")
})

Client.on("message", (message) => {
    const {content} = message;
    if (content.startsWith(Config.prefix)) {
        // Récupère tous les arguments de la commande.
        const args = content.split(" ");
        // Récupère le type de la commande.
        const cmd = args.shift().substr(Config.prefix.length).toLowerCase();
        // Récupère le contenu de la commande.
        const cmd_args = args;
        // Execute la commande si elle existe
        try {
            // Chargement de la commande
            const command = require(`./commands/${cmd}.js`);
            // Excecution de la commande
            command.execute(Client, message, args, State)
        } catch (e) {
            console.log(e.stack)
        }
    }
})

Client.login(process.env.TOKEN).catch(e => console.log(e));