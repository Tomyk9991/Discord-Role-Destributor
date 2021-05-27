require('dotenv').config(); // Recommended way of loading dotenv

import container from "./injection/inversify.config";
import {TYPES} from "./injection/Types";
import {Bot} from "./bot";

let bot = container.get<Bot>(TYPES.Bot);

bot.listen().then(() => {
    console.log('Logged in!')
}).catch((error) => {
    console.log('Oh no! ', error)
});
