import {Client} from "discord.js";


export default interface IResponse<T> {
    response(client: Client): T;
}
