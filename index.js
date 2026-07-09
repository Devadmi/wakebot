const mineflayer = require('mineflayer');

const bot = mineflayer.createBot({
    host: 'node-sg-free-01.tickhosting.com',
    port: 50979,
    username: 'WakeBot',
    version: '1.21.11'
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