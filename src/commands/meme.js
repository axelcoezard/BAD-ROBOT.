import Please from "./pls"

/**
 * La commande Meme (!meme) permet de demander au bot
 * de renvoyer un meme trouvé sur l'un des subreddits
 * prédéfinis dans la fonction.
 */
const Meme = async (client, message, args, state) => {
    const subReddits = [
        "dankmemes",
        "memes",
        "me_irl",
        "terriblefacebookmemes",
        "teenagers"
    ];

    const random = subReddits[Math.floor(Math.random() * subReddits.length)];

    Please(client, message, [random], state);
}

export default Meme;