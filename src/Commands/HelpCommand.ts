import Command from "./Command";
import {Client, Message} from "discord.js";
import {Constants} from "../Constants";

export default class HelpCommand extends Command {
    constructor() {
        super("help");
    }

    matches(value: string): boolean {
        return this.hasPrefix(value) && this.withoutPrefix(value) === this.command;
    }

    public async respond(client: Client, message:Message): Promise<void> {
        let rustEmote: string = (client.emojis.valueOf().find(emote => emote.name === "rust")).toString();

        await message.channel.send(this.createStandardEmbed("Hilfe",
            {name: "Befehl 1:", value: "`" + Constants.prefix + "configure`", inline: false},
            {name: "Befehl 2:", value: "`" + Constants.prefix + "roles`", inline: false},
            {name: "Befehl 3:", value: "`" + Constants.prefix + "addRole \"Rust\"` " + rustEmote, inline: true},
            {name: "Befehl 4:", value: "`" + Constants.prefix + "removeRole \"Rust\"`", inline: true},
            {name: "Befehl 5:", value: "`" + Constants.prefix + "start channelID`", inline: false}
        ));
    }

    do(value: string): void {
    }

    hasChangesToDo(): boolean {
        return false;
    }

}
