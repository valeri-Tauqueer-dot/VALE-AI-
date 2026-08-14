// ==========================
// VALE AI FRONTEND
// ==========================

const API_URL = "https://vale-backend-ye4r.onrender.com";


// ==========================
// LOGOUT
// ==========================

function logout() {

    localStorage.removeItem("vale_token");

    window.location.href = "login.html";
}


// ==========================
// CHAT
// ==========================

async function sendMessage() {

    const input = document.getElementById("userInput");
    const chat = document.getElementById("chatBox");

    const message = input.value.trim();

    if (!message) return;

    chat.innerHTML += `
        <p><b>You:</b> ${message}</p>
    `;

    input.value = "";

    try {

        const response = await fetch(
            `${API_URL}/chat`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    message: message
                })
            }
        );

        if (!response.ok) {
            throw new Error("Backend returned an error.");
        }

        const data = await response.json();

        chat.innerHTML += `
            <p><b>VALE:</b> ${data.vale}</p>
        `;

        chat.scrollTop = chat.scrollHeight;

    } catch (error) {

        console.error("VALE backend error:", error);

        chat.innerHTML += `
            <p><b>VALE:</b> Backend connection failed.</p>
        `;
    }
}
