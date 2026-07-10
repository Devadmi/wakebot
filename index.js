const mineflayer = require('mineflayer');

const HOST = 'node-sg-free-01.tickhosting.com';
const PORT = 50979;
const VERSION = process.env.MC_VERSION || '1.21.11';
const USERNAME = 'WakeBot';

let attempts = 0;

function connect() {
    attempts++;
    console.log(`\n=== Attempt ${attempts} ===`);
    console.log(`Connecting with Minecraft ${VERSION}...`);

    const bot = mineflayer.createBot({
        host: HOST,
        port: PORT,
        username: USERNAME,
        version: VERSION
    });

    let handled = false;

    bot.on('spawn', () => {
        console.log("Connected!");

        setTimeout(() => {
            console.log("Wake complete.");
            bot.quit();
            process.exit(0);
        }, 30000);
    });

    bot.on('kicked', (reason) => {
        if (handled) return;
        handled = true;

        const text = JSON.stringify(reason);
        console.log("Kicked:", text);

        if (text.includes("If you wish to use IP forwarding")) {
            console.log("Backend server is online!");
            process.exit(0);
            return;
        }

        if (
            text.includes("100%") ||
            text.includes("Server is starting, please wait")
        ) {
            console.log("Server is starting (100%). Waiting 15 seconds...");
            setTimeout(connect, 15000);
            return;
        }

        const match = text.match(/Estimated wait:.*?~(\d+)\s+minute/);

        if (match) {
            const minutes = parseInt(match[1]);

            let wait;

            if (minutes <= 1) {
                wait = 30;
            } else {
                wait = (minutes - 1) * 60;
            }

            console.log(`Queue says ~${minutes} minute(s).`);
            console.log(`Waiting ${wait} seconds...`);

            setTimeout(connect, wait * 1000);
            return;
        }

        if (
            text.includes("The server will start soon") ||
            text.includes("Please wait and try reconnecting")
        ) {
            console.log("Server is starting. Waiting 60 seconds...");
            setTimeout(connect, 60000);
            return;
        }

        console.log("Unknown kick. Retrying in 10 seconds...");
        setTimeout(connect, 10000);
    });

    bot.on('error', (err) => {
        console.log("Error:", err.message);

        if (!handled) {
            handled = true;
            setTimeout(connect, 10000);
        }
    });
}

connect();