import {Client} from "discord.js";

export default interface IResponse {
    response(client: Client): string;
}
