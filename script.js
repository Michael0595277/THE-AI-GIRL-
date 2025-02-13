document.addEventListener("DOMContentLoaded", async function () {
    const priceElement = document.getElementById("token-price");
    const connectWalletButton = document.getElementById("connect-wallet");
    const sendTransactionButton = document.getElementById("send-transaction");
    const transactionStatus = document.getElementById("transaction-status");

    // Fetch Token Price
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

    // Handle Send Transaction
    sendTransactionButton.addEventListener("click", async (event) => {
        event.preventDefault(); // Prevent form from submitting normally

        const recipientAddress = document.getElementById("recipient").value;
        const amount = document.getElementById("amount").value;

        if (!recipientAddress || !amount) {
            transactionStatus.textContent = "Please provide both recipient and amount.";
            return;
        }

        if ("solana" in window) {
            try {
                const connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl("mainnet-beta"), "confirmed");
                const senderPublicKey = window.solana.publicKey;
                const transaction = new solanaWeb3.Transaction();

                // Create the transaction instruction
                const transactionInstruction = solanaWeb3.SystemProgram.transfer({
                    fromPubkey: senderPublicKey,
                    toPubkey: new solanaWeb3.PublicKey(recipientAddress),
                    lamports: solanaWeb3.LAMPORTS_PER_SOL * parseFloat(amount), // Convert amount to lamports
                });

                transaction.add(transactionInstruction);

                // Sign and send the transaction
                const signedTransaction = await window.solana.signTransaction(transaction);
                const signature = await connection.sendRawTransaction(signedTransaction.serialize());

                transactionStatus.textContent = `Transaction sent! Waiting for confirmation...`;
                await connection.confirmTransaction(signature);
                transactionStatus.textContent = `Transaction confirmed! Signature: ${signature}`;
            } catch (error) {
                console.error("Transaction Failed:", error);
                transactionStatus.textContent = "Transaction failed. Please try again.";
            }
        } else {
            alert("Solana wallet not found. Please install Phantom Wallet.");
        }
    });
});