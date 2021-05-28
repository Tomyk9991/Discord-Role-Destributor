export default class DiscordRole
{
    private _name: string;
    private _emote: string;


    constructor(name: string, emote: string) {
        this._name = name;
        this._emote = emote;
    }


    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    get emote(): string {
        return this._emote;
    }

    set emote(value: string) {
        this._emote = value;
    }

    public toString(): string {
        return this.name + " with emote: " + this.emote;
    }
}
