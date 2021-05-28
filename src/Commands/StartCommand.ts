import Command from "./Command";
import {Channel, Client, EmbedFieldData, Message, MessageEmbed, TextChannel} from "discord.js";
import DiscordRoleManager from "../DiscordRoleManager";
import DiscordRole from "../DiscordRole";

export default class StartCommand extends Command {
    private channelID: string;

    public constructor(private discordRoleManager: DiscordRoleManager) {
        super("start");
    }

    public do(value: string): void {
        let splitValue: string[] = value.split(" ");
        this.channelID = splitValue[1];
    }

    public hasChangesToDo(): boolean {
        return true;
    }

    public matches(value: string): boolean {
        return this.hasPrefix(value) && this.withoutPrefix(value).toLowerCase().startsWith(this.command);
    }

    public async respond(client: Client, message: Message): Promise<void> {
        let objs: EmbedFieldData[] = [];
        for (let i = 0; i < this.discordRoleManager.roleLength(); i++)
        {
            let role: DiscordRole = this.discordRoleManager.get(i);
            let emote: string = (client.emojis.valueOf().find(emote => emote.name === role.emote)).toString();

            objs.push({name: (i + 1).toString(), value: role.name + " with emote: " + emote, inline: false});
        }

        let embed: MessageEmbed = this.createStandardEmbedArray("Rollenverteilung", objs);

        let channel: Channel = client.channels.cache.get(this.channelID);

        if (channel.isText()) {
            await (<TextChannel> channel).send(embed);
        }
    }
}
