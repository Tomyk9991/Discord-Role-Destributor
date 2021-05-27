import ICommand from "./ICommand";
import {Constants} from "../Constants";

export default class StartCommand implements ICommand {
    matches(value: string): boolean {
        if (value.startsWith(Constants.prefix) && value.substring(1, value.length) === "configure") {
            return true;
        }
    }

}
