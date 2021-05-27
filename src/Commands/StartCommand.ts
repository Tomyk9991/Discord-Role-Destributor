import Command from "./Command";
import {Constants} from "../Constants";
import {Client, MessageEmbed} from "discord.js";

export default class StartCommand extends Command {

    constructor() {
        super("configure");
    }

    matches(value: string): boolean {
        return value.startsWith(Constants.prefix) && this.withoutPrefix(value).toLowerCase() === this.command;
    }

    respond(client: Client): MessageEmbed {
        let rustEmote: string = (client.emojis.valueOf().find(emote => emote.name === "rust")).toString();


        return this.createStandardEmbed("Wie konfiguriere ich einen Bot?",
                {name: 'Beispiel:', value: `!addRole "Rust" ${rustEmote}`, inline: false});
    }

    do(value: string): void {
    }

    hasChangesToDo(): boolean {
        return false;
    }
}
