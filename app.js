async function sendMessage() {

    const input = document.getElementById("userInput");
    const chat = document.getElementById("chatBox");

    const message = input.value;

    if (!message) return;

    chat.innerHTML += `
        <p><b>You:</b> ${message}</p>
    `;

    try {

        const response = await fetch(
            "https://vale-backend-ye4r.onrender.com/chat",
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

        const data = await response.json();

        chat.innerHTML += `
            <p><b>VALE:</b> ${data.vale}</p>
        `;

    } catch (error) {

        chat.innerHTML += `
            <p><b>VALE:</b> Backend connection failed.</p>
        `;

        console.log(error);
    }

    input.value = "";
}