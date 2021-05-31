import Command from "./Command";
import {Channel, Client, EmbedFieldData, Message, MessageEmbed, MessageReaction, TextChannel} from "discord.js";
import DiscordRoleManager from "../DiscordRoleManager";
import DiscordRole from "../DiscordRole";
import StartCommandListener from "./CommandListeners/StartCommandListener";
import ColorConsole, {Color, ColorString} from "./Utilities/ColorConsole";

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
        for (let i = 0; i < this.discordRoleManager.roleLength(); i++) {
            let role: DiscordRole = this.discordRoleManager.get(i);
            let emote: string = (client.emojis.valueOf().find(emote => emote.name === role.emote)).toString();

            objs.push({name: (i + 1).toString(), value: role.name + " with emote: " + emote, inline: false});
        }

        let embed: MessageEmbed = this.createStandardEmbedArray("Rollenverteilung", objs)
                .setDescription("❗ Um einer Rolle hinzugefügt zu werden, wähle die passenden Reaktionen unterhalb dieser Nachricht aus ❗");

        let channel: Channel = client.channels.cache.get(this.channelID);

        if (channel && channel.isText()) {
            let sentMessage: Message = await (<TextChannel>channel).send(embed);
            //Speicher diese Message ID, damit sie wiedergefunden werden kann, falls der Bot abstürzen sollte
            this.discordRoleManager.saveLatestMessage(sentMessage);

            let sentReactions: MessageReaction[] = await this.addReactionsToMessage(sentMessage, client);
            let listener: StartCommandListener = StartCommandListener.getOrCreate();
            await listener.listenToMessageReaction(sentMessage, this.discordRoleManager);
        } else {
            ColorConsole.PrintColoredReset(new ColorString("Channel wurde nicht gefunden", Color.FgRed));
        }
    }

    private async addReactionsToMessage(sentMessage: Message, client: Client): Promise<MessageReaction[]> {
        let pool: Promise<MessageReaction>[] = [];

        for (let i = 0; i < this.discordRoleManager.roleLength(); i++) {
            let discordRole: DiscordRole = this.discordRoleManager.get(i);
            let emote: string = (client.emojis.valueOf().find(emote => emote.name === discordRole.emote)).toString();

            pool.push(sentMessage.react(emote));
        }

        return Promise.all(pool);
    }
}
