import Discord from "discord.js"
import dotenv from "dotenv"

dotenv.config()

const Client = new Discord.Client();

const prefix = "!";

Client.on("ready", () => {

})

Client.on("message", message => {
    
})

Client.login(process.env.TOKEN);