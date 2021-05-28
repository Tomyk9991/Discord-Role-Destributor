import Command from "./Command";
import {Client, EmbedFieldData, Message} from "discord.js";
import DiscordRoleManager from "../DiscordRoleManager";
import DiscordRole from "../DiscordRole";

export default class RemoveCommand extends Command {
    public constructor(private readonly discordRoleManager: DiscordRoleManager) {
        super("removeRole");
    }
    public do(value: string): void {
        if (this.hasAddRoleFormat(value)) {
            let correctedValue: string = value.replace(/\s+/g, ' ');
            let parts: string[] = correctedValue.split("\"");

            let roleName: string = parts[1];

            if (!roleName.startsWith("\"")) roleName = "\"" + roleName;
            if (!roleName.endsWith("\"")) roleName = roleName + "\"";

            this.discordRoleManager.remove(roleName);
            this.discordRoleManager.printRoles();
        }
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

            objs.push({name: (i + 1).toString(), value: "`" + role.name + " with emote:` " + emote, inline: false});
        }

        await message.channel.send(this.createStandardEmbedArray("Rollen, nach der Entfernung:", objs));
    }

    private hasAddRoleFormat(value: string) : boolean {
        let correctedValue: string = value.replace(/\s+/g, ' ');
        let parts: string[] = correctedValue.split("\"");

        return parts.length == 3 && this.withoutPrefix(parts[0]).toLowerCase().startsWith(this.command);
    }

}
