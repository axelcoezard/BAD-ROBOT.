import Volume from "./volume";

const Mute = async (client, message, args, state) => {
    Volume(client, message, [0], state);
}

export default Mute;