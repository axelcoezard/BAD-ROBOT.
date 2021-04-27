import fs from "fs";
import path from "path";
import YAML from "yaml";

import Play from "./play"

const __CACHE_FILE = "soundboard.json";

const Soundboard = async (client, message, args, state) => {
    if (args.length < 1) return;

    const command = args.shift();

    switch (command) {
        case "add": __add(client, message, args, state); break;
        case "remove": __remove(client, message, args, state); break;
        case "list": __list(client, message, args, state); break;
        case "random": __random(client, message, state); break;
        default: __play(client, message, command, state); break;
    }
}

const __load = async () => {
    const file = await fs.readFileSync(
        path.join(__dirname, "../cache/" + __CACHE_FILE),{ 
        encoding: "utf8"
    })
    return YAML.parse(file)
}

const __save = async (data) => {
    fs.writeFileSync(
        path.join(__dirname, "../cache/" + __CACHE_FILE),
        JSON.stringify(data)
    )
}

const __add = async (client, message, args, state) => {
    if (args.length != 2) return;
    
    const data = await __load();
    data[args[0]] = args[1];

    __save(data);
}

const __remove = async (client, message, args, state) => {
    if (args.length != 1) return;
    
    const data = await __load()   
    delete data[args[0]]

    __save(data);
}

const __list = async (client, message, args, state) => {
    const data = await __load()
}

const __random = async (client, message, state) => {
    const data = await __load()
    const data_keys = Object.keys( data);
    
    const random_id = Math.floor(Math.random() * data_keys.length)
    const URL = data[data_keys[random_id]]

    try {
        Play(client, message, [URL], state);
    } catch (e) {
        console.log(e.stack)
    }
}

const __play = async (client, message, audio_name, state) => {
    if (!audio_name) return;

    const data = await __load()
    
    try {
        const URL = data[audio_name];
        if (URL)
            Play(client, message, [URL], state);
    } catch (e) {
        console.log(e.stack)
    }
}

export default Soundboard;