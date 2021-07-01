import Command from "./Command";
import {Client, EmbedFieldData, Message} from "discord.js";
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
        let objs: EmbedFieldData[] = this.createEmbedFieldData(client, this.discordRoleManager);
        await message.channel.send(this.createStandardEmbedArray("Bisherige Rollen:", objs));
    }

}
