import "reflect-metadata";
import {Container} from "inversify";
import {TYPES} from "./types";
import {Client} from "discord.js";
import {Bot} from "../Bot";
import DiscordRoleManager from "../DiscordRoleManager";

let container = new Container();

container.bind<DiscordRoleManager>(TYPES.DiscordRoleManager).toConstantValue(new DiscordRoleManager("discordRoles.json"));
container.bind<Bot>(TYPES.Bot).to(Bot).inSingletonScope();
container.bind<Client>(TYPES.Client).toConstantValue(new Client());
container.bind<string>(TYPES.Token).toConstantValue(process.env.TOKEN);

export default container;
