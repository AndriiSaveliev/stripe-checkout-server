const express = require("express");
const Stripe = require("stripe");
const cors = require("cors");
require("dotenv").config();
const crypto = require("crypto");

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
console.log("STRIPE_SECRET_KEY:", process.env.STRIPE_SECRET_KEY);


app.use(cors({
    origin: "*", // Можно указать конкретные домены, например: ["http://localhost:63342", "https://твой-сайт.github.io"]
    methods: ["POST"],
    allowedHeaders: ["Content-Type"]
}));
app.use(express.json());

app.post("/create-checkout-session", async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: { name: "Service" },
                        unit_amount: 1000,
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: "https://byuvia-stripe-bvdu5395t-andriisavelievs-projects.vercel.app/success.html",
            cancel_url: "https://byuvia-stripe-bvdu5395t-andriisavelievs-projects.vercel.app/cancel.html",
        });
        res.json({ id: session.id });
    } catch (error) {
        console.error("Ошибка сервера:", error);
        res.status(500).json({ error: error.message });
    }
});

// CSP Policy (Используем nonce и sha256)
app.use((req, res, next) => {
    const nonce = crypto.randomBytes(16).toString("base64");
    res.locals.nonce = nonce;
    res.setHeader(
        "Content-Security-Policy",
        `style-src 'self' 'nonce-${nonce}' 'sha256-LC/f4AHe6QWgeaqDNJ51QR21lz0ZlpPj2iL2ZeERPVw=' https://applepay.cdn-apple.com;`
    );
    next();
});

// Запускаем сервер (Должен быть последним!)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

