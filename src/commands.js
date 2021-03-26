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
        this.queue = [];
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
        // Vérifie que l'utilisateur est dans une channel.
        if (voiceChannel) {
            // Définition de la fonction de lecture de queue
            const playQueue = (videoURL) => {
                // Définition des options de download.
                const options = { quality: "highestaudio"};
                // Récupération du fichier audio.
                const download = ytdl(videoURL, options);
                // Lecture et diffusion du fichier audio.
                this.dispatcher = this.connection.play(download);
                // Envoie d'un message de confirmation
                textChannel.send(`**Joue actuellement** :notes: \`${videoURL}\``);
                // Supprime le flux après lecture
                this.dispatcher.on("finish", () => {
                    this.queue.shift();
                    this.dispatcher.destroy();
                    if (this.queue.length > 0) 
                    playQueue(this.queue[0]);
                });
            }  
            
            this.queue.push(args[0]);
            if (this.queue.length <= 1) {
                voiceChannel.join().then(connection => {
                    this.connection = connection;
                    // Envoie d'un message de confirmation
                    textChannel.send(`:thumbsup: **Connecté à** \`${voiceChannel.name}\``);
                    // Vidage de la queue lors de la déconnection
                    this.connection.on("disconnect", () => this.queue = []);
                    // Défini la fonction de lecture de la queue
                    playQueue(this.queue[0])   
                });  
            } else textChannel.send(`:thumbsup: **Ajouté à la queue**`);
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
