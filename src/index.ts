require('dotenv').config(); // Recommended way of loading dotenv

import container from "./injection/inversify.config";
import {TYPES} from "./injection/Types";
import {Bot} from "./Bot";

let bot = container.get<Bot>(TYPES.Bot);

bot.listen().then(async () => {
    console.log('Logged in!')
    await bot.tryHookToLatestStartCommand();
}).catch((error) => {
    console.log('Oh no! ', error)
});
