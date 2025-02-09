document.addEventListener("DOMContentLoaded", async function () {
    const priceElement = document.getElementById("token-price");
    const connectWalletButton = document.getElementById("connect-wallet");

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
});

// Animated Background
const canvas = document.getElementById("animated-bg");
const ctx = canvas.getContext("2d");

// Set canvas size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];

class Particle {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
        this.alpha = 1;
    }

    draw() {
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
        ctx.globalAlpha = 1;
    }

    update() {
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        
        if (this.x > canvas.width || this.x < 0) this.velocity.x *= -1;
        if (this.y > canvas.height || this.y < 0) this.velocity.y *= -1;

        this.draw();
    }
}

// Generate Particles
for (let i = 0; i < 50; i++) {
    let radius = Math.random() * 5 + 2;
    let x = Math.random() * canvas.width;
    let y = Math.random() * canvas.height;
    let color = `hsl(${Math.random() * 360}, 100%, 60%)`;
    let velocity = { x: (Math.random() - 0.5) * 2, y: (Math.random() - 0.5) * 2 };

    particles.push(new Particle(x, y, radius, color, velocity));
}

// Mouse Effect
let mouse = {
    x: undefined,
    y: undefined
};

window.addEventListener("mousemove", (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;

    for (let i = 0; i < 5; i++) {
        let radius = Math.random() * 4 + 1;
        let color = `hsl(${Math.random() * 360}, 100%, 60%)`;
        let velocity = { x: (Math.random() - 0.5) * 3, y: (Math.random() - 0.5) * 3 };

        particles.push(new Particle(mouse.x, mouse.y, radius, color, velocity));
    }
});

// Animation Loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((particle, index) => {
        particle.update();
        if (particle.alpha > 0.02) {
            particle.alpha -= 0.01;
        } else {
            particles.splice(index, 1);
        }
    });
    requestAnimationFrame(animate);
}

animate();