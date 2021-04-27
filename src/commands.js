import { MessageEmbed } from "discord.js"
import randomPuppy from "random-puppy"
import {memeAsync} from "memejs"
import ytdl from "ytdl-core"
import ytpl from "ytpl"

import Config from "./config";

class Commands {

    /**
     * 
     */
    constructor () {
        this.connection = null;
        this.dispatcher = null;
        this.videoQueue = [];
        this.playing = false;
        this.videoVolume = 50;
    }
    
    /**
     * 
     */
    async skip (message, args) {
        // Récupère la channel de l'utilisateur
        const voiceChannel = message.member.voice.channel;
        const textChannel = message.channel;
        // 
        if (!this.playing && !this.dispatcher) {
            message.channel.send(
                `:warning:  **Aucune lecture en cours**`
            );
            return console.log("[BOT] Aucune lecture en cours")
        }
        //
        this.dispatcher.destroy();
        this.playing = false;
        //
        this.videoQueue.shift();
        //
        if (this.videoQueue.length == 0) {
            console.log("[BOT] Aucun son dans la liste de lecture")
            return this.dispatcher.destroy();
        }
        //
        const tmpQueue = this.videoQueue;
        this.videoQueue = [];
        //
        message.channel.send(
            `:fast_forward: **Lecture du son suivant...**`
        );
        console.log("[BOT] Lecture du son suivant...")
        //
        this.play(message, tmpQueue)        
    }
    
    /**
     * 
     */
    async queue (message, args) {
        const textChannel = message.channel;
        if  (this.videoQueue.length > 0) {
            const embed = new MessageEmbed()
            .setColor("GREEN")
            .setTitle(`Contenu de la file d'attente`)
            .setDescription("Voici tous les titres qui sont dans la file d'attente:")
            .setTimestamp();

            this.videoQueue.forEach(async (videoURL, i) => {
                const videoInfo = await ytdl.getBasicInfo(videoURL);
                const videoName = await videoInfo.videoDetails.title;
                const videoDuration = await videoInfo.videoDetails.length_seconds;
                embed.addField(
                    "\u200b",
                    `**○** \`${videoName.substring(0, 250)}...\``,
                );
                if (i == this.videoQueue.length - 1) {
                    embed.addField("\u200b", `**${this.videoQueue.length} titres dans la file d'attente**`, "");
                    textChannel.send(embed)
                }
            })
        } else {
            textChannel.send(`:x: **La file d'attente est actuellement vide**...`);
        }
    }

    /**
     * 
     */
    async helpme (message, args) {
        const embed = new MessageEmbed()
        .setColor("GREEN") 
        .setTitle("Liste des commandes")
        .setDescription("Voici toutes les commandes du BAD ROBOT.:")
        .addField("`!join`", "faire que le bot rejoigne le channel vocal.")
        .addField("`!leave`", "faire que le bot à quitte le channel vocal.")
        .addField("`!play`", "relance la lecture de la file d'attente.")
        .addField("`!play` <lien_video_youtube>", "ajoute la musique correspondante à la liste d'attente et lance immediatement la lecture si elle est seule dedans.")
        .addField("`!play` <lien_playlist_youtube>", "ajoute toutes les musiques de la playlist à la liste d'attente et lance immediatement la lecture si aucune musique n'est déjà entrain de se jouer.")
        .addField("`!pause`", "met en pause la lecture de la musique.")
        .addField("`!pause`", "met en pause la lecture de la musique.")
        .addField("`!meme`", "renvoie un meme choisi aléatoirement depuis des subreddits prédéfinis.")
        .addField( "**[NFSW]** `!pls` <nom_de_subbreddit>", "renvoie une image choisi aléatoirement depuis le subreddit indiqué.")
        .setTimestamp();

        message.channel.send(embed)
        console.log("[BOT] Envoie de la liste des commandes")
    }
}

export default Commands;
