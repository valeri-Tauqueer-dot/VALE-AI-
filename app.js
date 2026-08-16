// ==========================
// VALE AI INTERFACE
// ==========================

const API_URL =
    "https://vale-backend-ye4r.onrender.com";


// ==========================
// LOGOUT
// ==========================

function logout() {

    localStorage.removeItem(
        "vale_token"
    );

    window.location.href =
        "login.html";
}


// ==========================
// SEND MESSAGE
// ==========================

async function sendMessage() {

    const input =
        document.getElementById("userInput");

    const chat =
        document.getElementById("chatBox");


    if (!input || !chat) {

        console.error(
            "VALE chat elements not found."
        );

        return;

    }


    const message =
        input.value.trim();


    if (!message) {

        return;

    }


    // ==========================
    // GET LOGIN TOKEN
    // ==========================

    const token =
        localStorage.getItem(
            "vale_token"
        );


    if (!token) {

        window.location.href =
            "login.html";

        return;

    }


    // ==========================
    // SHOW USER MESSAGE
    // ==========================

    const userMessage =
        document.createElement("p");

    userMessage.textContent =
        "You: " + message;

    chat.appendChild(
        userMessage
    );


    input.value = "";


    try {

        // ==========================
        // SEND TO VALE BACKEND
        // ==========================

        const response =
            await fetch(
                `${API_URL}/chat`,
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json",

                        "Authorization":
                            "Bearer " + token

                    },

                    body:
                        JSON.stringify({

                            message:
                                message

                        })

                }
            );


        // ==========================
        // TOKEN INVALID / EXPIRED
        // ==========================

        if (response.status === 401) {

            localStorage.removeItem(
                "vale_token"
            );

            window.location.href =
                "login.html";

            return;

        }


        // ==========================
        // OTHER SERVER ERROR
        // ==========================

        if (!response.ok) {

            throw new Error(
                "VALE server error: " +
                response.status
            );

        }


        const data =
            await response.json();


        // ==========================
        // SHOW VALE RESPONSE
        // ==========================

        const valeMessage =
            document.createElement("p");

        valeMessage.textContent =
            "VALE: " + data.vale;

        chat.appendChild(
            valeMessage
        );


        chat.scrollTop =
            chat.scrollHeight;


    } catch (error) {

        console.error(
            "VALE chat error:",
            error
        );


        const errorMessage =
            document.createElement("p");

        errorMessage.textContent =
            "VALE: Unable to connect to the server.";

        chat.appendChild(
            errorMessage
        );

    }

}
