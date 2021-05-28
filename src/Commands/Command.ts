import {Constants} from "../Constants";
import {Client, EmbedFieldData, Message, MessageEmbed} from "discord.js";

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
