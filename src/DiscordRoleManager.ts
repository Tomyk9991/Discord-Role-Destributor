import DiscordRole from "./DiscordRole";

export default class DiscordRoleManager {
    private roles: DiscordRole[];
    private readonly filePath: string;

    constructor(filePath: string) {
        this.filePath = filePath;
        this.roles = [];
        this.load();
    }

    public add(role: DiscordRole): void {
        this.roles.push(role);
    }

    public remove(role: DiscordRole): void {
        const index: number = this.roles.indexOf(role, 0);
        if (index > -1) {
            this.roles.splice(index, 1);
        }
    }

    public save(): void {
        let fs = require('fs');
        let data: string = JSON.stringify(this.roles);
        fs.writeFileSync(this.filePath, data);
    }

    public load(): DiscordRole[] {
        if (this.roles !== null) {
            return this.roles;
        } else {
            const fs = require('fs');

            if (fs.existsSync(this.filePath)) {
                let rawData = fs.readFileSync(this.filePath);
                let discordRoles: DiscordRole[] = JSON.parse(rawData);

                this.roles = discordRoles;
                return this.roles;
            }
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
