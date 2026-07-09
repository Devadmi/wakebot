const mineflayer = require('mineflayer');

const bot = mineflayer.createBot({
    host: 'esssmp.tkmc.net',
    port: 25565,
    username: 'WakeBot'
});

bot.on('spawn', () => {
    console.log("Joined!");

    setTimeout(() => {
        bot.quit();
        process.exit(0);
    }, 20000);
});

bot.on('error', console.log);
bot.on('kicked', console.log);