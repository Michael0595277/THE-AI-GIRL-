document.addEventListener("DOMContentLoaded", async function () {
    const priceElement = document.getElementById("token-price");

    async function fetchPrice() {
        try {
            const response = await fetch("https://api.dexscreener.com/latest/dex/pairs/solana/2oxhczyjsgtvcyhj8thqeaveqgay4aq4skk5hhnwcxri");
            const data = await response.json();
            const price = data.pairs[0].priceUsd;
            priceElement.textContent = `$${parseFloat(price).toFixed(4)}`;
        } catch (error) {
            priceElement.textContent = "Error loading price";
            console.error("Error fetching price:", error);
        }
    }

    fetchPrice();
    setInterval(fetchPrice, 30000); // Update price every 30 seconds

    // Wallet Connection
    const connectWalletButton = document.getElementById("connect-wallet");

    connectWalletButton.addEventListener("click", async () => {
        if ("solana" in window) {
            try {
                const response = await window.solana.connect();
                alert(`Connected: ${response.publicKey.toString()}`);
            } catch (err) {
                console.error("Wallet Connection Failed:", err);
            }
        } else {
            alert("Solana wallet not found. Please install Phantom Wallet.");
        }
    });
});