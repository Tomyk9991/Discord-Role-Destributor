import DiscordRole from "./DiscordRole";
import {GuildMember, Message, Role, User} from "discord.js";
import {IIOMessage} from "./IIOMessage";

export default class DiscordRoleManager {
    private roles: DiscordRole[];
    private readonly filePath: string;
    private readonly latestMessageFilePath: string;
    private readonly authorizedUsersPath: string;

    constructor(filePath: string, latestMessageFilePath: string, authorizedUsersPath) {
        this.filePath = filePath;
        this.latestMessageFilePath = latestMessageFilePath;
        this.authorizedUsersPath = authorizedUsersPath;

        this.roles = [];
        this.load();

        this.printRoles();
    }

    public printRoles(): void {
        for (let i = 0; i < this.roles.length; i++) {
            console.log("Role: " + this.roles[i].toString());
        }
    }

    public update(role: DiscordRole): boolean {
        let found: boolean = false;

        for (let i = 0; i < this.roles.length; i++) {
            if (this.roles[i].name.toLowerCase() === role.name.toLowerCase()) {
                this.roles[i] = role;
                found = true;
                this.save();
                break;
            }
        }
        return found;
    }

    public add(role: DiscordRole): void {
        for (let i = 0; i < this.roles.length; i++) {
            if (this.roles[i].name.toLowerCase() === role.name.toLowerCase()) {
                this.roles[i] = role;
                this.save();
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


    public saveLatestMessage(message: Message): void {
        let fs =require('fs');

        let data: string = JSON.stringify({
            latestMessageID: message.id,
            channelID: message.channel.id
        });

        fs.writeFileSync(this.latestMessageFilePath, data);
    }

    public loadLatestMessageID(): IIOMessage {
        const fs = require('fs');

        if (fs.existsSync(this.latestMessageFilePath)) {
            let rawData = fs.readFileSync(this.latestMessageFilePath);
            let parsedData: any = JSON.parse(rawData);

            return {
                latestMessageID: parsedData.latestMessageID,
                channelID: parsedData.channelID
            };
        }

        console.log("Didn't find latestMessageID");
        return null;
    }

    public loadAuthorizedUsers(): string[] {
        const fs = require('fs');

        if (fs.existsSync(this.authorizedUsersPath)) {

            let rawData = fs.readFileSync(this.authorizedUsersPath);
            return JSON.parse(rawData);
        }

        return [];
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

    public static async addUserToDiscordRole(user: User, discordRole: DiscordRole, message: Message): Promise<void> {
        let roleName: string = discordRole.name.substring(1, discordRole.name.length - 1);
        let role: Role = message.guild.roles.cache.find(role => role.name.toLowerCase() === roleName.toLowerCase());

        if (role) {
            let member: GuildMember = message.guild.member(user);
            await member.roles.add(role);
        } else {
            await message.channel.send("`Rolle wurde nicht gefunden. Wende dich an einen Administrator.`").then((msg: Message) => {
                setTimeout(() => msg.delete(), 5000);
            });
        }
    }

    public static async removeUserFromDiscordRole(user: User, discordRole: DiscordRole, message: Message) {
        let roleName: string = discordRole.name.substring(1, discordRole.name.length - 1);
        let role: Role = message.guild.roles.cache.find(role => role.name.toLowerCase() === roleName.toLowerCase());

        if (role) {
            let member: GuildMember = message.guild.member(user);
            await member.roles.remove(role);
        } else {
            await message.channel.send("`Rolle wurde nicht gefunden. Wende dich an einen Administrator.`").then((msg: Message) => {
                setTimeout(() => msg.delete(), 5000);
            }).catch(reason => {});
        }
    }
}
