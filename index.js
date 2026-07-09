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

    let serverStarting = false;

    bot.on('message', (message) => {
        const text = message.toString();

        console.log("Server message:", text);

        // Tick.Hosting queue/start message
        if (
            text.includes("queue") ||
            text.includes("loading") ||
            text.includes("The server will start soon")
        ) {
            serverStarting = true;
            console.log("Server is starting. Waiting...");
        }

        // Server is fully online (proxy forwarding error = success)
        if (text.includes("If you wish to use IP forwarding")) {
            console.log("Server is online!");

            bot.quit();

            setTimeout(() => {
                process.exit(0);
            }, 2000);
        }
    });

    bot.on('spawn', () => {
        console.log("Joined Minecraft server!");

        // If it somehow joins normally
        setTimeout(() => {
            console.log("Wake complete.");
            bot.quit();
            process.exit(0);
        }, 30000);
    });

    bot.on('kicked', (reason) => {
        console.log("Kicked:", reason);

        retry(serverStarting);
    });

    bot.on('error', (err) => {
        console.log("Error:", err.message);

        retry(serverStarting);
    });

    function retry(starting) {
        bot.removeAllListeners();

        // Don't spam Tick.Hosting while it is starting
        const delay = starting ? 60000 : 10000;

        console.log(`Retrying in ${delay / 1000} seconds...`);

        setTimeout(() => {
            connect();
        }, delay);
    }
}

connect();