import {Client, Message} from "discord.js";
import {inject, injectable} from "inversify";
import {TYPES} from "./injection/Types";
import ICommand from "./Commands/ICommand";
import StartCommand from "./Commands/StartCommand";
import IResponse from "./Responses/IResponse";
import StartResponse from "./Responses/StartResponse";

@injectable()
export class Bot {
    private readonly client: Client;
    private readonly token: string;
    private commands: ICommand[];
    private responses: IResponse[];

    constructor(
            @inject(TYPES.Client) client: Client,
            @inject(TYPES.Token) token: string
    ) {
        this.client = client;
        this.token = token;
        this.commands = [new StartCommand() ];
        this.responses = [new StartResponse() ]
    }

    public listen(): Promise < string > {
        this.client.on('message', (message: Message) => {
            for (let i = 0; i < this.commands.length; i++) {
                if (this.commands[i].matches(message.content)) {
                    let value: string = this.responses[i].response(this.client);
                    message.channel.send(value);
                }
            }
        });

        return this.client.login(this.token);
    }
}
