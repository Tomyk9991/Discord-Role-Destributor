import Command from "./Command";
import {Client, MessageEmbed} from "discord.js";
import {Constants} from "../Constants";

export default class HelpCommand extends Command {
    constructor() {
        super("help");
    }

    matches(value: string): boolean {
        return this.hasPrefix(value) && this.withoutPrefix(value) === this.command;
    }

    respond(client: Client): MessageEmbed {
        let rustEmote: string = (client.emojis.valueOf().find(emote => emote.name === "rust")).toString();

        return this.createStandardEmbed("Hilfe",
            {name: "Befehl 1:", value: Constants.prefix + "configure", inline: false},
            {name: "Befehl 2:", value: Constants.prefix + "addRole \"Rust\"" + rustEmote, inline: false}
        );
    }

    do(value: string): void {
    }

    hasChangesToDo(): boolean {
        return false;
    }

}
