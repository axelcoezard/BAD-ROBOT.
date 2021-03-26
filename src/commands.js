import { MessageEmbed } from "discord.js"
import randomPuppy from "random-puppy"
import ytdl from "ytdl-core"

import Config from "./config";

class Commands {
    /**
     * 
     */
    constructor () {
        this.connection = null;
        this.dispatcher = null;
        this.videoQueue = [];
    }

    /**
     * 
     */
    async meme (message, args) {
        // Récupère la liste des subReddits autorisés.
        const subReddits = Config.subReddits;
        // Séléctionne un subReddit aléatoirement.
        const random = subReddits[Math.floor(Math.random() * subReddits.length)];
        // Récupère une image aléatoire sur le subReddit.
        const image = await randomPuppy(random);
        const embed = new MessageEmbed()
            .setColor("BLUE")
            .setImage(image)
            .setTitle(`via /r/${random}`)
            .setTimestamp()
            .setURL(`https://reddit.com/r/${random}`);
        // Envoie le meme sur Discord.
        message.channel.send(embed);
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
        if (args.length == 1 && voiceChannel) {
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
                // Supprime le flux après lecture
                this.dispatcher.on("finish", () => {
                    this.videoQueue.shift();
                    this.dispatcher.destroy();
                    if (this.videoQueue.length > 0) playQueue(this.videoQueue[0]);
                });
            }  
            
            this.videoQueue.push(args[0]);
            if (this.videoQueue.length <= 1) {
                voiceChannel.join().then(connection => {
                    this.connection = connection;
                    // Envoie d'un message de confirmation
                    textChannel.send(`:thumbsup: **Connecté à** \`${voiceChannel.name}\``);
                    // Vidage de la file d 'attente lors de la déconnection
                    this.connection.on("disconnect", () => this.videoQueue = []);
                    // Défini la fonction de lecture de la queue
                    playQueue(this.videoQueue[0])   
                });  
            } else textChannel.send(`:thumbsup: **Ajouté à la file d'attente**`);
        }        
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
                embed.addField(
                    "\u200b",
                    `\`${i + 1}.\` ${videoName.substring(0, 255)}`,
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
    }
}

export default Commands;
