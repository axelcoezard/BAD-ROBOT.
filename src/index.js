import Discord from "discord.js"
import Dotenv from "dotenv"

import Config from "./config"
import Commands from "./commands"

const Client = new Discord.Client();

Dotenv.config();

Client.on("ready", () => {
    console.log("working")
})

Client.on("message", (message) => {
    const {content} = message;
    if (content.startsWith(Config.prefix)) {
        // Récupère tous les arguments de la commande.
        const args = content.split(" ");
        // Récupère le type de la commande.
        const cmd = args.shift().substr(Config.prefix.length);
        // Récupère le contenu de la commande.
        const cmd_args = args;
        // Execute la commande si elle existe
        if (cmd in Commands) Commands[cmd](cmd_args);
    }
})

Client.login(process.env.TOKEN).catch(e => console.log(e));