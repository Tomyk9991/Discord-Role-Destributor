import IResponse from "./IResponse";
import {Client, MessageEmbed} from "discord.js";

export default class StartResponse implements IResponse<MessageEmbed> {
    response(client: Client): MessageEmbed {
        let rustEmote: string = (client.emojis.valueOf().find(emote => emote.name === "rust")).toString();

        const exampleEmbed: MessageEmbed = new MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Wie konfiguriere ich den Bot?')
        .addField('Beispiel:', `!addRole "Rust" ${rustEmote}`)
        .setTimestamp()
        .setFooter('Bei Problemen an Tomyk#1337 wenden', 'https://i.imgur.com/qxhUKkj.png');

        return exampleEmbed;
    };
}
