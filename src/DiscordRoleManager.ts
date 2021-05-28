import DiscordRole from "./DiscordRole";

export default class DiscordRoleManager {
    private roles: DiscordRole[];
    private readonly filePath: string;

    constructor(filePath: string) {
        this.filePath = filePath;
        this.roles = [];
        this.load();

        this.printRoles();
    }

    public printRoles(): void {
        for (let i = 0; i < this.roles.length; i++) {
            console.log("Role: " + this.roles[i].toString());
        }
    }

    public add(role: DiscordRole): void {
        for (let i = 0; i < this.roles.length; i++) {
            if (this.roles[i].name.toLowerCase() === role.name.toLowerCase()) {
                this.roles[i] = role;
                this.save();
                return;
            }
        }

        this.roles.push(role);
        this.save();
    }

    public remove(roleName: string): void {
        let index: number = -1;

        for (let i = 0; i < this.roles.length; i++) {
            if (this.roles[i].name === roleName) {
                index = i;
                break;
            }
        }

        if (index > -1) {
            this.roles.splice(index, 1);
            this.save();
        }
    }

    public save(): void {
        let fs = require('fs');
        let data: string = JSON.stringify(this.roles);
        fs.writeFileSync(this.filePath, data);
    }

    public load(): DiscordRole[] {
        const fs = require('fs');


        if (fs.existsSync(this.filePath)) {

            let rawData = fs.readFileSync(this.filePath);
            let parsedData: any[] = JSON.parse(rawData);

            this.roles = [];

            for (let i = 0; i < parsedData.length; i++) {
                this.roles.push(new DiscordRole(parsedData[i]._name, parsedData[i]._emote));
            }

            return this.roles;
        }

        return null;
    }

    public roleLength(): number {
        return this.roles.length;
    }

    public get(i: number): DiscordRole {
        return i < 0 || i >= this.roles.length ? null : this.roles[i];
    }
}
