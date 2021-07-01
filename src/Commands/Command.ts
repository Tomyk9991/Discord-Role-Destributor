import {Constants} from "../Constants";
import {Client, EmbedFieldData, Message, MessageEmbed} from "discord.js";
import DiscordRole from "../DiscordRole";
import DiscordRoleManager from "../DiscordRoleManager";

export default abstract class Command {
    protected command: string;

    protected constructor(command: string) {
        this.command = command.toLowerCase();
    }

    abstract matches(value: string) : boolean;
    abstract respond(client: Client, message: Message) : Promise<void>;

    abstract hasChangesToDo(): boolean;
    abstract do(value: string): void;

    protected hasPrefix(value: string): boolean {
        return value.startsWith(Constants.prefix);
    }

    protected withoutPrefix(value: string) : string {
        return value.substring(1, value.length);
    }

    protected createStandardEmbedArray(title: string, lines: EmbedFieldData[]): MessageEmbed {
        const embed: MessageEmbed = new MessageEmbed()
                .setColor('#0099ff')
                .setTitle(title)
                .addFields(lines)
                .setTimestamp()
                .setFooter('Bei Problemen an Tomyk#1337 wenden', 'https://i.imgur.com/qxhUKkj.png');

        return embed;
    }

    protected createRoleDistributionInterface(client: Client, discordRoleManager: DiscordRoleManager) {
        let objs: EmbedFieldData[] = [];

        for (let i = 0; i < discordRoleManager.roleLength(); i++) {
            let role: DiscordRole = discordRoleManager.get(i);
            let emote: string = (client.emojis.valueOf().find(emote => emote.name === role.emote)).toString();

            objs.push({name: (i + 1).toString(), value: role.name + " mit dem Emote: " + emote, inline: false});
        }

        let embed: MessageEmbed = this.createStandardEmbedArray("Rollenverteilung", objs)
                .setDescription("❗ Um einer Rolle hinzugefügt zu werden, wähle die passenden Reaktionen unterhalb dieser Nachricht aus ❗")
                .setFooter('Bei Problemen an MrP3w wenden');

        return embed;
    }

    protected createStandardEmbed(title: string, ... lines: EmbedFieldData[]): MessageEmbed {
        const embed: MessageEmbed = new MessageEmbed()
        .setColor('#0099ff')
        .setTitle(title)
        .addFields(lines)
        .setTimestamp()
        .setFooter('Bei Problemen an Tomyk#1337 wenden', 'https://i.imgur.com/qxhUKkj.png');

        return embed;
    }
}
