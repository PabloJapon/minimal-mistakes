---
title: "verify-account"
permalink: /verifyAccount/
layout: splash
---
Hola

<script>
    async function sendData() {
        const message = "hello, world from md";

        try {
            const response = await fetch("/.netlify/functions/verificar-sesion", {
                method: "POST",
                body: JSON.stringify({ message }),
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (response.ok) {
                const responseData = await response.json();
                console.log("Response from server:", responseData);
            } else {
                console.error("Failed to send data to server.");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }

    // Automatically send data when the page loads
    sendData();
</script>