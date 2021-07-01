import {Client, Message} from "discord.js";
import DiscordRole from "../DiscordRole";

export default interface IRerenderHookedMessage {
    OnRerenderHookedMessage(client: Client, hookedMessage: Message): Promise<void>;
}
