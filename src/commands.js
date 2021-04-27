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
    }

    /**
     * 
     */
    async meme (message, args) {
        // Récupère la liste des subReddits autorisés.
        const subReddits = Config.subReddits;
        // Séléctionne un subReddit aléatoirement.
        const random = subReddits[Math.floor(Math.random() * subReddits.length)];
        // Répond avec une image aléatoire
        this.pls(message, [random]);
    }

    /**
     * 
     */
    async flemmeradio (message, args) {
        this.play(message, ["https://www.youtube.com/watch?v=NcLxD6tkLxo"]);
    }
    
    /**
     * 
     */
    async dickinsideme (message, args) {
        this.play(message, ["https://www.youtube.com/watch?v=hnI5_dwa7nw"]);
    }
    
    /**
     * 
     */
    async kudo (message, args) {
        this.play(message, ["https://www.youtube.com/watch?v=lx4uH_lw2Dg"]);
    }
    
    /**
     * 
     */
    async aw (message, args) {
        this.play(message, ["https://www.youtube.com/watch?v=fps1UuEoNx0"]);
    }
    
    /**
     * 
     */
    async skeletor (message, args) {
        this.play(message, ["https://www.youtube.com/watch?v=oL_fLFPaStI"]);
    }
    
    /**
     * 
     */
    async pls (message, args) { 
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
        } catch (err) {}
    }

    /**
     * 
     */
    async join (message, args) {
        // Récupère la channel de l'utilisateur
        const {channel} = message.member.voice;
        // Vérifie que l'utilisateur est dans une channel.
        if (channel) {
            channel.join().then(con => this.connection = con);
        }
    }

    /**
     * 
     */
    async play (message, args) {
        // Récupère la channel de l'utilisateur
        const voiceChannel = message.member.voice.channel;
        const textChannel = message.channel;
        // Reprend la lecture si elle est en pause.
        if (args.length == 0 && this.dispatcher) {
            this.dispatcher.resume();
            textChannel.send(`:arrow_forward:  **Lecture en cours dans** \`${voiceChannel.name}\``);   
        }
        // Vérifie que l'utilisateur est dans une channel.
        if (args.length >= 1 && voiceChannel) {
            // Définition de la fonction de lecture de queue
            const playQueue = async (videoURL) => {
                // Définition des options de download.
                const options = { quality: "highestaudio"};
                // Récupération du fichier audio.
                const download = ytdl(videoURL, options);
                // Lecture et diffusion du fichier audio.
                this.dispatcher = this.connection.play(download);
                // Envoie d'un message de confirmation
                textChannel.send(`**A la recherche de** :mag_right: \`${videoURL}\``);
                const videoInfo = await ytdl.getBasicInfo(videoURL);
                textChannel.send(`**Joue actuellement** :notes: \`${videoInfo.videoDetails.title}\``);
                console.log(`[BOT] Joue actuellement: ${videoInfo.videoDetails.title}`)
                // Supprime le flux après lecture
                this.dispatcher.on("finish", () => {
                    this.videoQueue.shift();
                    this.dispatcher.destroy();
                    if (this.videoQueue.length > 0) playQueue(this.videoQueue[0]);
                    else this.playing = false;
                });
            }  
            
            if (args.length > 1) {
                // Passe à la prochaine musique
                this.videoQueue = args;
            } else {
                // Regarde si c'est une playlist
                const URL_params = new URLSearchParams(args[0])
                if (URL_params.has("list")) {
                    const PLAYLIST_id = URL_params.get("list");
                    const playlist = await ytpl(PLAYLIST_id);
                    playlist.items.forEach(i => this.videoQueue.push(i.shortUrl))
                } else {
                    this.videoQueue.push(args[0]);
                }
            }            

            if (!this.playing) {
                voiceChannel.join().then(connection => {
                    this.connection = connection;
                    // Envoie d'un message de confirmation
                    textChannel.send(`:thumbsup: **Connecté à** \`${voiceChannel.name}\``);
                    // Vidage de la file d 'attente lors de la déconnection
                    this.connection.on("disconnect", () => {
                        this.videoQueue = []
                        this.playing = false;
                    });
                    // Défini la fonction de lecture de la queue
                    playQueue(this.videoQueue[0])   
                });  
                this.playing = true;
            } else textChannel.send(`:thumbsup: **Ajouté(s) à la file d'attente**`);
        }        
    }

    /**
     * 
     */
    async skip (message, args) {
        // Récupère la channel de l'utilisateur
        const voiceChannel = message.member.voice.channel;
        const textChannel = message.channel;
        // 
        if (!playing && !this.dispatcher) return false;
        //
        this.dispatcher.stop();
        this.playing = false;
        //
        this.videoQueue.shift();
        const tmpQueue = this.videoQueue;
        this.videoQueue = [];
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
    async pause (message, args) {
        if (this.dispatcher) {
            this.dispatcher.pause();
            message.channel.send(
                `:pause_button: **Lecture mise en pause dans** \`${message.member.voice.channel.name}\``
            );        
        }
    }

    /**
     * 
     */
    async leave (message, args) {
        if (this.dispatcher) this.dispatcher.destroy();
        if (this.connection) this.connection.disconnect();
        this.playing = false;
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

    /**
     * 
     */
    async help (message, args) {

    }
}

export default Commands;
