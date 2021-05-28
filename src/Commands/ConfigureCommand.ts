import Command from "./Command";
import {Constants} from "../Constants";
import {Client, Message, MessageEmbed} from "discord.js";

export default class ConfigureCommand extends Command {

    public constructor() {
        super("configure");
    }

    public matches(value: string): boolean {
        return value.startsWith(Constants.prefix) && this.withoutPrefix(value).toLowerCase() === this.command;
    }

    public async respond(client: Client, message: Message): Promise<void> {
        let rustEmote: string = (client.emojis.valueOf().find(emote => emote.name === "rust")).toString();


        await message.channel.send(this.createStandardEmbed("Wie konfiguriere ich einen Bot?",
                {name: 'Beispiel:', value: "\`" + Constants.prefix + `addRole "Rust"\` ${rustEmote}`, inline: false}));
    }

    public do(value: string): void {
    }

    public hasChangesToDo(): boolean {
        return false;
    }
}
