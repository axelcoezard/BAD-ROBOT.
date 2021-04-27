import { MessageEmbed } from "discord.js"

const Help = async (client, message, args, state) => {
    const embed = new MessageEmbed()
    .setColor("GREEN") 
    .setTitle("Liste des commandes")
    .setDescription("Voici toutes les commandes du BAD ROBOT.:")
    .addField("`!join`", "faire que le bot rejoigne le channel vocal.")
    .addField("`!leave`", "faire que le bot à quitte le channel vocal.")
    .addField("`!play <lien_video_youtube>`", "ajoute la musique correspondante à la liste d'attente et lance immediatement la lecture si elle est seule dedans.")
    .addField("`!play <lien_playlist_youtube>`", "ajoute toutes les musiques de la playlist à la liste d'attente et lance immediatement la lecture si aucune musique n'est déjà entrain de se jouer.")
    .addField("`!skip`", "passe à la musique suivante.")
    .addField("`!pause`", "met en pause la lecture de la musique.")
    .addField("`!resume`", "relance la lecture de la file d'attente.")
    .addField("`!volume <pourcentage>`", "met le volume du bot à <pourcentage>%.")
    .addField("`!mute`", "met le volume du bot à 0%.")

    .addField("`!sound add <nom> <lien>`", "ajoute à la soundboard le son <nom> et sa source ytb <lien>.")
    .addField("`!sound remove <nom>`", "supprime de la soundboard le son <nom>.")
    .addField("`!sound list`", "affiche la liste des sons.")
    .addField("`!sound random`", "lance la lecture d'un son aléatoire.")
    .addField("`!sound <nom>`", "lance la lecture du son <nom>.")

    .addField("`!meme`", "renvoie un meme choisi aléatoirement depuis des subreddits prédéfinis.")
    .addField( "**[NFSW]** `!pls` <nom_de_subbreddit>", "renvoie une image choisi aléatoirement depuis le subreddit indiqué.")
    .setTimestamp();

    message.channel.send(embed)
    console.log("[BOT] Envoie de la liste des commandes")
}

export default Help;