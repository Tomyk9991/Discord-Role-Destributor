import {Client, Message} from "discord.js";
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

@injectable()
export class Bot {
    private readonly client: Client;
    private readonly token: string;
    private commands: Command[];

    constructor(@inject(TYPES.Client) client: Client, @inject(TYPES.Token) token: string, @inject(TYPES.DiscordRoleManager) discordRoleManager) {
        this.client = client;
        this.token = token;
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
}
