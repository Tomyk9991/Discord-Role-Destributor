import Command from "./Command";
import {Client, EmbedFieldData, Message, MessageEmbed, MessageMentionOptions, MessageReaction} from "discord.js";
import DiscordRoleManager from "../DiscordRoleManager";
import DiscordRole from "../DiscordRole";
import IRerenderHookedMessage from "./IRerenderHookedMessage";
import ColorConsole, {Color, ColorString} from "./Utilities/ColorConsole";

export default class RemoveCommand extends Command implements IRerenderHookedMessage {
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

    async OnRerenderHookedMessage(client: Client, hookedMessage: Message): Promise<void> {
        if (hookedMessage == null) return;

        console.log("Removing role from already existing message with id: " + hookedMessage.id);
        let embed: MessageEmbed = this.createRoleDistributionInterface(client, this.discordRoleManager);

        await hookedMessage.edit(embed);
        let reactionToRemove: MessageReaction = this.filterReactionToRemove(hookedMessage);

        await this.removeReaction(hookedMessage, reactionToRemove, client);
    }

    private filterReactionToRemove(hookedMessage: Message): MessageReaction {
        let currentReactions: MessageReaction[] = hookedMessage.reactions.valueOf().array();
        let reactionToRemove: MessageReaction = null;

        for (let i = 0; i < currentReactions.length; i++) {
            let reaction: MessageReaction = currentReactions[i];
            let modifiedReactionName: string = reaction.emoji.name;

            let found = false;

            // if this current reaction is not included in my roleManager, this reaction has to removed
            for (let j = 0; j < this.discordRoleManager.roleLength(); j++) {
                if (modifiedReactionName === this.discordRoleManager.get(j).emote) {
                    found = true;
                    break;
                }
            }

            if (!found) {
                reactionToRemove = reaction;

                ColorConsole.PrintColoredReset(
                        new ColorString("Emoji"),
                        new ColorString(reaction.emoji.name, Color.FgRed),
                        new ColorString("will be removed")
                );

                break;
            }
        }

        return reactionToRemove;
    }

    private async removeReaction(target: Message, reactionToRemove, client: Client): Promise<void> {

        await target.reactions.valueOf().filter((mr: MessageReaction) => {
            return mr === reactionToRemove;
        }).first().remove();
    }


    private hasAddRoleFormat(value: string) : boolean {
        let correctedValue: string = value.replace(/\s+/g, ' ');
        let parts: string[] = correctedValue.split("\"");

        return parts.length == 3 && this.withoutPrefix(parts[0]).toLowerCase().startsWith(this.command);
    }

}
