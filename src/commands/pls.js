import { MessageEmbed } from "discord.js"
import {memeAsync} from "memejs"

const pls = (client, message, args, state) => {
    const subReddit = args[0];
    // Récupère une image aléatoire sur le subReddit.
    try {
        const image = await memeAsync(subReddit);
        const embed = new MessageEmbed()
        .setColor("GREEN")
        .setImage(await image.url)    
        .setURL(`https://reddit.com/r/${subReddit}`);
        // Envoie le meme sur Discord.
        message.channel.send(embed);
        console.log(`[BOT] Envoie d'une image du subReddit ${subReddit}.`)
    } catch (e) {
        console.log(e.stack);
    }
}

export default pls;