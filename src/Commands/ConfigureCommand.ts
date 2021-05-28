import Command from "./Command";
import {Constants} from "../Constants";
import {Client, EmbedFieldData, Message} from "discord.js";

export default class ConfigureCommand extends Command {

    public constructor() {
        super("configure");
    }

    public matches(value: string): boolean {
        return value.startsWith(Constants.prefix) && this.withoutPrefix(value).toLowerCase() === this.command;
    }

    public async respond(client: Client, message: Message): Promise<void> {
        let rustEmote: string = (client.emojis.valueOf().find(emote => emote.name === "rust")).toString();


        let objs: EmbedFieldData[] = [
            {name: 'Beispiel:', value: "\`" + Constants.prefix + `addRole "Rust"\` ${rustEmote}`, inline: true},
            {name: 'Beispiel:', value: "\`" + Constants.prefix + `removeRole "Rust"\``, inline: true}
        ];

        await message.channel.send(this.createStandardEmbedArray("Wie konfiguriere ich einen Bot?", objs));
    }

    public do(value: string): void {
    }

    public hasChangesToDo(): boolean {
        return false;
    }
}
