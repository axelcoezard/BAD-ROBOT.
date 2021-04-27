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
       
    }
}

export default Commands;
