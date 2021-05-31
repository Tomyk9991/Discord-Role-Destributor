import {Channel, Client, Message, MessageReaction, ReactionCollector, TextChannel, User} from "discord.js";
import {inject, injectable} from "inversify";
import {TYPES} from "./injection/Types";
import ConfigureCommand from "./Commands/ConfigureCommand";
import HelpCommand from "./Commands/HelpCommand";
import Command from "./Commands/Command";
import AddRoleCommand from "./Commands/AddRoleCommand";
import RoleCommand from "./Commands/RoleCommand";
import StartCommand from "./Commands/StartCommand";
import RemoveCommand from "./Commands/RemoveCommand";
import UpdateRoleCommand from "./Commands/UpdateRoleCommand";
import DiscordRoleManager from "./DiscordRoleManager";
import {IIOMessage} from "./IIOMessage";
import DiscordRole from "./DiscordRole";

@injectable()
export class Bot {
    private readonly client: Client;
    private readonly token: string;
    private commands: Command[];
    private discordRoleManager: DiscordRoleManager;

    constructor(@inject(TYPES.Client) client: Client, @inject(TYPES.Token) token: string, @inject(TYPES.DiscordRoleManager) discordRoleManager) {
        this.client = client;
        this.token = token;
        this.discordRoleManager = discordRoleManager;

        this.commands = [
            new ConfigureCommand(),
            new HelpCommand(),
            new AddRoleCommand(discordRoleManager),
            new RemoveCommand(discordRoleManager),
            new RoleCommand(discordRoleManager),
            new StartCommand(discordRoleManager),
            new UpdateRoleCommand(discordRoleManager)
        ];
    }

    public listen(): Promise <string> {

        this.client.on('message', async (message: Message) => {
            for (let i = 0; i < this.commands.length; i++)
            {
                let command: Command = this.commands[i];
                if (command.matches(message.content))
                {
                    if (command.hasChangesToDo()) {
                        command.do(message.content);
                    }

                    await this.commands[i].respond(this.client, message);
                }
            }
        });

        return this.client.login(this.token);
    }


    public async tryHookToLatestStartCommand() :Promise<void> {
        let loadedMessage: IIOMessage = this.discordRoleManager.loadLatestMessageID();


        if (loadedMessage != null) {
            let channel: Channel = await this.client.channels.fetch(loadedMessage.channelID);
            let message: Message = await (<TextChannel>channel).messages.fetch(loadedMessage.latestMessageID);

            if (message){
                let isRoleEmote = (reaction: MessageReaction, user: User) => {
                    let found: boolean = false;

                    for (let i = 0; i < this.discordRoleManager.roleLength(); i++) {
                        if (this.discordRoleManager.get(i).emote === reaction.emoji.name) {
                            found = true;
                            break;
                        }
                    }

                    return found;
                }

                let onNewReaction = async (reaction: MessageReaction, user: User) => {
                    console.log("User " + user.username + " is reacting to " + reaction.emoji.name);

                    let index: number = -1;
                    for (let i = 0; i < this.discordRoleManager.roleLength(); i++) {
                        if (reaction.emoji.name === this.discordRoleManager.get(i).emote) {
                            index = i;
                            break;
                        }
                    }

                    if (index != -1) {
                        let role: DiscordRole = this.discordRoleManager.get(index);
                        await DiscordRoleManager.addUserToDiscordRole(user, role, message);
                    }
                };

                let onRemoveReaction = async (reaction: MessageReaction, user: User) => {
                    console.log("User " + user.username + " removed the reaction to " + reaction.emoji.name);

                    let index: number = -1;
                    for (let i = 0; i < this.discordRoleManager.roleLength(); i++) {
                        if (reaction.emoji.name === this.discordRoleManager.get(i).emote) {
                            index = i;
                            break;
                        }
                    }

                    if (index != -1) {
                        let role: DiscordRole = this.discordRoleManager.get(index);
                        await DiscordRoleManager.removeUserFromDiscordRole(user, role, message);
                    }
                };

                console.log("Hooking back to message with ID: " + loadedMessage.latestMessageID);
                const collector: ReactionCollector = message.createReactionCollector(isRoleEmote, {dispose: true});

                collector.on("collect", await onNewReaction);
                collector.on("remove", await onRemoveReaction);
            } else {
                console.log("Didn't find message in channel Bot.ts");
            }
        }
    }
}
