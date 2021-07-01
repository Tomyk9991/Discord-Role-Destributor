import {Message, MessageReaction, ReactionCollector, User} from "discord.js";
import DiscordRole from "../../DiscordRole";
import DiscordRoleManager from "../../DiscordRoleManager";
import ColorConsole, {Color, ColorString} from "../Utilities/ColorConsole";

export default class StartCommandListener {
    get currentHookedMessage(): Message {
        return this._currentHookedMessage;
    }

    private static instance: StartCommandListener;
    private collector: ReactionCollector;
    private _currentHookedMessage: Message;

    public static getOrCreate() : StartCommandListener {
        if (StartCommandListener.instance == null) {
            StartCommandListener.instance = new StartCommandListener();
        }

        return StartCommandListener.instance;
    }

    private unhookFromLatestMessage() : void {
        if (this.collector != null) {

            ColorConsole.PrintColoredReset(
                    new ColorString("stop listening to old collector with message ID:\t"),
                    new ColorString(this.collector.message.id, Color.FgYellow)
            );

            this.collector?.stop("New Collector. Old message was: " + this.collector.message.id);
        }
    }

    public async listenToMessageReaction(sentMessage: Message, discordRoleManager: DiscordRoleManager): Promise<void>
    {
        this._currentHookedMessage = sentMessage;
        let isRoleEmote = (reaction: MessageReaction, user: User) => {
            let found: boolean = false;

            for (let i = 0; i < discordRoleManager.roleLength(); i++) {
                if (discordRoleManager.get(i).emote === reaction.emoji.name) {
                    found = true;
                    break;
                }
            }

            return found;
        }

        let onNewReaction = async (reaction: MessageReaction, user: User) => {
            if (user.bot) return;

            ColorConsole.PrintColoredReset(
                    new ColorString("User"),
                    new ColorString(user.username, Color.FgGreen),
                    new ColorString("is reacting to"),
                    new ColorString(reaction.emoji.name, Color.FgGreen),
            );

            let index: number = -1;
            for (let i = 0; i < discordRoleManager.roleLength(); i++) {
                if (reaction.emoji.name === discordRoleManager.get(i).emote) {
                    index = i;
                    break;
                }
            }

            if (index != -1) {
                let role: DiscordRole = discordRoleManager.get(index);
                await DiscordRoleManager.addUserToDiscordRole(user, role, sentMessage);
            }
        };

        let onRemoveReaction = async (reaction: MessageReaction, user: User) => {
            if (user.bot) return;

            ColorConsole.PrintColoredReset(
                    new ColorString("User"),
                    new ColorString(user.username, Color.FgRed),
                    new ColorString("removed the reaction to"),
                    new ColorString(reaction.emoji.name, Color.FgRed),
            );

            let index: number = -1;
            for (let i = 0; i < discordRoleManager.roleLength(); i++) {
                if (reaction.emoji.name === discordRoleManager.get(i).emote) {
                    index = i;
                    break;
                }
            }

            if (index != -1) {
                let role: DiscordRole = discordRoleManager.get(index);
                await DiscordRoleManager.removeUserFromDiscordRole(user, role, sentMessage);
            }
        };


        this.unhookFromLatestMessage();

        this.collector = sentMessage.createReactionCollector(isRoleEmote, {dispose: true});

        this.collector.on("collect", await onNewReaction);
        this.collector.on("remove", await onRemoveReaction);

        let line: string = "";
        for (let i = 0; i < process.stdout.columns; i++) { line += "-"; }

        console.log(line);

        ColorConsole.PrintColoredReset(
                new ColorString("Hooking to message with ID:\t\t\t\t"),
                new ColorString(sentMessage.id, Color.FgYellow)
        );

        ColorConsole.PrintColoredReset(
                new ColorString("Message from:\t\t\t\t\t\t"),
                new ColorString(sentMessage.createdAt.toDateString() + " " + sentMessage.createdAt.toTimeString(), Color.FgYellow)
        );
    }
}
