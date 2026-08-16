// ==========================
// VALE AI FRONTEND
// ==========================

const API_URL =
    "https://vale-backend-ye4r.onrender.com";


// ==========================
// LOGOUT
// ==========================

function logout() {

    localStorage.removeItem("vale_token");

    window.location.href = "login.html";
}


// ==========================
// ADD CHAT MESSAGE SAFELY
// ==========================

function addChatMessage(chat, sender, text) {

    const paragraph =
        document.createElement("p");

    const label =
        document.createElement("b");

    label.textContent =
        sender + ":";

    paragraph.appendChild(label);

    paragraph.appendChild(
        document.createTextNode(
            " " + String(text)
        )
    );

    chat.appendChild(paragraph);
}


// ==========================
// CHAT
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
    // CHECK LOGIN TOKEN
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


    // Show user message

    addChatMessage(
        chat,
        "You",
        message
    );


    input.value = "";


    try {

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
        // AUTHENTICATION FAILURE
        // ==========================

        if (response.status === 401) {

            localStorage.removeItem(
                "vale_token"
            );

            window.location.href =
                "login.html";

            return;

        }


        if (!response.ok) {

            throw new Error(
                "Backend returned HTTP " +
                response.status
            );

        }


        const data =
            await response.json();


        // Show VALE response safely

        addChatMessage(
            chat,
            "VALE",
            data.vale
        );


        chat.scrollTop =
            chat.scrollHeight;


    } catch (error) {

        console.error(
            "VALE backend error:",
            error
        );


        addChatMessage(
            chat,
            "VALE",
            "Backend connection failed."
        );

    }

}
