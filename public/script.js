const stripe = Stripe("pk_test_51R4EtLHGQDPF3kFEQGxdqgeGhzFSsgJZlfbZkEeMDMqHHdSauqqC2PNQ9zVUQmZ4nV1kss8rVxTxivBK2JhMTS5l004mAsedHN");

document.getElementById("payButton").addEventListener("click", async () => {
    try {
        const response = await fetch("https://stripe-checkout-server-production-c1c1.up.railway.app/create-checkout-session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({}) // Должен быть хотя бы пустой объект
        });

        if (!response.ok) {
            throw new Error(`Ошибка сервера: ${response.status}`);
        }

        const session = await response.json();
        await stripe.redirectToCheckout({ sessionId: session.id });
    } catch (error) {
        console.error("Ошибка:", error);
    }
});