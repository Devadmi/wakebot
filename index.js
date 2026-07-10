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

    bot.on('spawn', () => {
        console.log("Joined the server!");
    });

    bot.on('message', (message) => {
        console.log("Message:", message.toString());
    });

    bot.on('kicked', (reason) => {
        console.log("Kicked:", reason);

        const text = JSON.stringify(reason);

        // SUCCESS! The backend server is now online.
        if (text.includes("If you wish to use IP forwarding")) {
            console.log("Backend server is online! Wake complete.");
            process.exit(0);
            return;
        }

        // Tick.Hosting queue / starting messages
        if (
            text.includes("Server is starting") ||
            text.includes("100%") ||
            text.includes("queue") ||
            text.includes("The server will start soon") ||
            text.includes("Please wait and try reconnecting")
        ) {
            console.log("Server is still starting. Waiting 60 seconds before trying again...");

            setTimeout(() => {
                connect();
            }, 60000);

            return;
        }

        // Unknown kick
        console.log("Unknown kick. Retrying in 10 seconds...");

        setTimeout(() => {
            connect();
        }, 10000);
    });

    bot.on('error', (err) => {
        console.log("Error:", err.message);

        setTimeout(() => {
            connect();
        }, 10000);
    });

    bot.on('end', () => {
        console.log("Disconnected.");
    });
}

connect();