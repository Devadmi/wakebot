const mineflayer = require('mineflayer');

let tries = 0;

function connect() {
    tries++;
    console.log(`Checking server... Attempt ${tries}`);

    const bot = mineflayer.createBot({
        host: 'node-sg-free-01.tickhosting.com',
        port: 50979,
        username: 'WakeBot',
        version: '1.21.11'
    });

    bot.on('message', (message) => {
        const text = message.toString();

        console.log("Server message:", text);

        if (
            text.includes("If you wish to use IP forwarding")
        ) {
            console.log("Server is online!");

            bot.quit();

            setTimeout(() => {
                process.exit(0);
            }, 2000);
        }
    });

    bot.on('spawn', () => {
        console.log("Joined Minecraft server!");

        setTimeout(() => {
            console.log("Wake complete.");
            bot.quit();
            process.exit(0);
        }, 30000);
    });

    bot.on('kicked', (reason) => {
        console.log("Kicked:", reason);

        const text = JSON.stringify(reason);

        if (
            text.includes("queue") ||
            text.includes("server will start soon") ||
            text.includes("Please wait and try reconnecting")
        ) {
            console.log("Tick server is starting. Waiting 60 seconds...");

            setTimeout(() => {
                connect();
            }, 60000);

        } else {
            console.log("Normal kick. Retrying in 10 seconds...");

            setTimeout(() => {
                connect();
            }, 10000);
        }
    });

    bot.on('error', (err) => {
        console.log("Error:", err.message);

        setTimeout(() => {
            connect();
        }, 10000);
    });
}

connect();