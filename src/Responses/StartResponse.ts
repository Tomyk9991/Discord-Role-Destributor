import IResponse from "./IResponse";
import {Client} from "discord.js";

export default class StartResponse implements IResponse {
    response(client: Client): string {
        let rustEmote: any = (client.emojis.valueOf().find(emote => emote.name === "rust")).toString();
        let test: any = client.emojis.resolveIdentifier(rustEmote);

        return "Um diesen Bot zu nutzen, müssen vorher Rollen bestimmt werden.\n" +
                "Dazu schreibe eine Rolle und sein emote mit Leerzeichen getrennt auf: \n" +
                "`!addRole Rust " + rustEmote + "`";
    };
}
