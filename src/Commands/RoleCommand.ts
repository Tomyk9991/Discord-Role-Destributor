import Command from "./Command";
import {Client, EmbedFieldData, Message, MessageEmbed} from "discord.js";
import DiscordRole from "../DiscordRole";
import DiscordRoleManager from "../DiscordRoleManager";

export default class RoleCommand extends Command {
    private readonly discordRoleManager: DiscordRoleManager;

    public constructor(discordRoleManager: DiscordRoleManager) {
        super("roles");
        this.discordRoleManager = discordRoleManager;
    }

    public do(value: string): void {
    }

    public hasChangesToDo(): boolean {
        return false;
    }

    public matches(value: string): boolean {
        return this.hasPrefix(value) && this.withoutPrefix(value) === this.command;
    }

    public async respond(client: Client, message: Message): Promise<void> {
        let objs: EmbedFieldData[] = [];

        for (let i = 0; i < this.discordRoleManager.roleLength(); i++)
        {
            let role: DiscordRole = this.discordRoleManager.get(i);
            let emote: string = (client.emojis.valueOf().find(emote => emote.name === role.emote)).toString();

            objs.push({name: (i + 1).toString(), value: "`" + role.name + " with emote:` " + emote, inline: false});
        }
        await message.channel.send(this.createStandardEmbedArray("Bisherige Rollen:", objs));
    }

}
