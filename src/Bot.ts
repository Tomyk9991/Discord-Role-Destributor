import {Client, Message, MessageEmbed} from "discord.js";
import {inject, injectable} from "inversify";
import {TYPES} from "./injection/Types";
import StartCommand from "./Commands/StartCommand";
import HelpCommand from "./Commands/HelpCommand";
import Command from "./Commands/Command";
import AddRoleCommand from "./Commands/AddRoleCommand";

@injectable()
export class Bot {
    private readonly client: Client;
    private readonly token: string;
    private commands: Command[];

    constructor(@inject(TYPES.Client) client: Client, @inject(TYPES.Token) token: string, @inject(TYPES.DiscordRoleManager) discordRoleManager) {
        this.client = client;
        this.token = token;
        this.commands = [new StartCommand(), new HelpCommand(), new AddRoleCommand(discordRoleManager)];
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

                    let value: MessageEmbed = this.commands[i].respond(this.client);
                    await message.channel.send(value);
                }
            }
        });

        return this.client.login(this.token);
    }
}
