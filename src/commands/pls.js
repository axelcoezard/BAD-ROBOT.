import { MessageEmbed } from "discord.js"
import { memeAsync } from "memejs"

/**
 * La commande Please (!pls) permet de demander au bot
 * de renvoyer un post trouvé sur le subreddit indiqué
 * par le premier argument.
 */
const Please = async (client, message, args, state) => {
    const subReddit = args[0];

    try {
        const image = await memeAsync(subReddit);
        const embed = new MessageEmbed()
        .setColor("GREEN")
        .setImage(await image.url)    
        .setURL(`https://reddit.com/r/${subReddit}`);

        message.channel.send(embed);

        console.log(`[BOT] Envoie d'une image du subReddit ${subReddit}.`)
    } catch (e) {
        console.log(e.stack);
    }
}

export default Please;