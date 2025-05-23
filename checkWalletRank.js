const fs = require('fs').promises;
const axios = require('axios');

// Function to delay execution
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function checkWallets() {
    try {
        // Read wallet addresses from wallet.txt
        const data = await fs.readFile('wallet.txt', 'utf8');
        const wallets = data.split('\n').map(line => line.trim()).filter(line => line);

        for (const wallet of wallets) {
            try {
                // Make POST request to the API
                const response = await axios.post('https://meco-leaderboard-api.memecore.com/dune/search', {
                    keyword: wallet
                }, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                // Get rank from response
                const rank = response.data.rank;

                // Check if rank is less than 10000
                if (rank && rank < 10000) {
                    console.log(`Winner! Wallet Address: ${wallet}`);
                } else {
                    console.log(`Wallet ${wallet} rank: ${rank} (not a winner)`);
                }

                // Wait for 1000ms before next request
                await delay(1000);
            } catch (error) {
                console.error(`Error processing wallet ${wallet}:`, {
                    message: error.message,
                    status: error.response?.status,
                    responseData: error.response?.data
                });
            }
        }
    } catch (error) {
        console.error('Error reading wallet.txt:', error.message);
    }
}

// Run the function
checkWallets();