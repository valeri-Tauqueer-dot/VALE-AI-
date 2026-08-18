/* =========================================================
   VALE AI — MAIN FRONTEND CONTROL SYSTEM
   Version: Foundation Upgrade

   Responsibilities:
   - Authentication check
   - VALE system status
   - Navigation
   - Chat
   - Logout
   - Loading / error states
   - Backend communication
   - Basic interface intelligence

   Camera + Voice are intentionally NOT included.
========================================================= */


/* =========================================================
   VALE CONFIGURATION
========================================================= */

const VALE_CONFIG = {

    API_URL: "https://vale-backend-ye4r.onrender.com",

    TOKEN_KEY: "vale_token",

    LOGIN_PAGE: "login.html",

    CHAT_ENDPOINT: "/chat",

    PROFILE_ENDPOINT: "/profile",

    HEALTH_ENDPOINT: "/health"

};


/* =========================================================
   VALE STATE
========================================================= */

const VALE_STATE = {

    authenticated: false,

    username: null,

    online: false,

    chatting: false,

    initialized: false

};


/* =========================================================
   DOM READY
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    initializeVALE();

});


/* =========================================================
   MAIN INITIALIZATION
========================================================= */

async function initializeVALE() {

    console.log("VALE: Initializing system...");

    setupNavigation();

    setupChat();

    setupLogout();

    setupCommandButton();

    await authenticateUser();

    VALE_STATE.initialized = true;

    console.log("VALE: Initialization complete.");

}


/* =========================================================
   AUTHENTICATION
========================================================= */

async function authenticateUser() {

    const token = localStorage.getItem(
        VALE_CONFIG.TOKEN_KEY
    );


    /* -----------------------------------------
       No token = user is not logged in
    ----------------------------------------- */

    if (!token) {

        VALE_STATE.authenticated = false;

        redirectToLogin();

        return;

    }


    /* -----------------------------------------
       Verify token with backend
    ----------------------------------------- */

    try {

        const response = await fetch(

            VALE_CONFIG.API_URL +
            VALE_CONFIG.PROFILE_ENDPOINT,

            {

                method: "GET",

                headers: {

                    "Authorization":
                        `Bearer ${token}`

                }

            }

        );


        if (!response.ok) {

            throw new Error(
                "Authentication failed."
            );

        }


        const data = await response.json();


        VALE_STATE.authenticated = true;

        VALE_STATE.username =
            data.username || null;


        console.log(
            "VALE: User authenticated.",
            VALE_STATE.username
        );


        updateUserInterface();


        startVALEStatus();


    }

    catch (error) {

        console.error(
            "VALE authentication error:",
            error
        );


        localStorage.removeItem(
            VALE_CONFIG.TOKEN_KEY
        );


        redirectToLogin();

    }

}


/* =========================================================
   REDIRECT TO LOGIN
========================================================= */

function redirectToLogin() {

    if (
        !window.location.pathname.endsWith(
            VALE_CONFIG.LOGIN_PAGE
        )
    ) {

        window.location.href =
            VALE_CONFIG.LOGIN_PAGE;

    }

}


/* =========================================================
   UPDATE USER INTERFACE
========================================================= */

function updateUserInterface() {

    if (!VALE_STATE.username) {

        return;

    }


    const welcomeElements =
        document.querySelectorAll(
            ".username"
        );


    welcomeElements.forEach(element => {

        element.textContent =
            VALE_STATE.username;

    });

}


/* =========================================================
   VALE STATUS
========================================================= */

async function startVALEStatus() {

    try {

        const response = await fetch(

            VALE_CONFIG.API_URL +
            VALE_CONFIG.HEALTH_ENDPOINT

        );


        if (!response.ok) {

            throw new Error(
                "VALE backend unavailable."
            );

        }


        const data =
            await response.json();


        VALE_STATE.online = true;


        console.log(
            "VALE backend:",
            data.status
        );


        updateOnlineIndicators(true);

    }

    catch (error) {

        console.warn(
            "VALE backend is waking or unavailable:",
            error
        );


        VALE_STATE.online = false;

        updateOnlineIndicators(false);

    }

}


/* =========================================================
   ONLINE INDICATORS
========================================================= */

function updateOnlineIndicators(online) {

    const indicators =
        document.querySelectorAll(
            ".panel-top span"
        );


    indicators.forEach(indicator => {

        if (online) {

            indicator.textContent =
                "● ONLINE";

            indicator.style.color =
                "#00ff9d";

        }

        else {

            indicator.textContent =
                "● CONNECTING";

            indicator.style.color =
                "#f6df8b";

        }

    });

}


/* =========================================================
   NAVIGATION
========================================================= */

function setupNavigation() {

    const links =
        document.querySelectorAll(
            ".nav-menu a"
        );


    links.forEach(link => {

        link.addEventListener(
            "click",
            event => {

                const href =
                    link.getAttribute("href");


                if (
                    !href ||
                    href === "#" ||
                    link.id === "logoutBtn"
                ) {

                    return;

                }


                console.log(
                    "VALE navigation:",
                    href
                );

            }
        );

    });

}


/* =========================================================
   COMMAND BUTTON
========================================================= */

function setupCommandButton() {

    const commandButton =
        document.getElementById(
            "commandBtn"
        );


    if (!commandButton) {

        return;

    }


    commandButton.addEventListener(
        "click",
        () => {

            console.log(
                "VALE: Entering Command Space..."
            );

            window.location.href =
                "command.html";

        }
    );

}


/* =========================================================
   CHAT SYSTEM
========================================================= */

function setupChat() {

    const input =
        document.getElementById(
            "userInput"
        );


    const sendButton =
        document.getElementById(
            "sendBtn"
        );


    if (!input || !sendButton) {

        return;

    }


    sendButton.addEventListener(
        "click",
        sendMessage
    );


    input.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Enter"
            ) {

                event.preventDefault();

                sendMessage();

            }

        }
    );

}


/* =========================================================
   SEND MESSAGE
========================================================= */

async function sendMessage() {

    if (VALE_STATE.chatting) {

        return;

    }


    const input =
        document.getElementById(
            "userInput"
        );


    const chatBox =
        document.getElementById(
            "chatBox"
        );


    const sendButton =
        document.getElementById(
            "sendBtn"
        );


    if (!input || !chatBox) {

        return;

    }


    const message =
        input.value.trim();


    if (!message) {

        return;

    }


    const token =
        localStorage.getItem(
            VALE_CONFIG.TOKEN_KEY
        );


    if (!token) {

        redirectToLogin();

        return;

    }


    /* -----------------------------------------
       Lock chat while processing
    ----------------------------------------- */

    VALE_STATE.chatting = true;


    if (sendButton) {

        sendButton.disabled = true;

        sendButton.textContent =
            "VALE THINKING...";

    }


    addChatMessage(
        "You",
        message
    );


    input.value = "";


    const thinkingMessage =
        addChatMessage(
            "VALE",
            "VALE is analyzing..."
        );


    try {

        const response = await fetch(

            VALE_CONFIG.API_URL +
            VALE_CONFIG.CHAT_ENDPOINT,

            {

                method: "POST",

                headers: {

                    "Content-Type":
                        "application/json",

                    "Authorization":
                        `Bearer ${token}`

                },

                body: JSON.stringify({

                    message: message

                })

            }

        );


        /* -------------------------------------
           Authentication expired
        ------------------------------------- */

        if (response.status === 401) {

            localStorage.removeItem(
                VALE_CONFIG.TOKEN_KEY
            );


            redirectToLogin();

            return;

        }


        if (!response.ok) {

            throw new Error(
                `Server error: ${response.status}`
            );

        }


        const data =
            await response.json();


        updateChatMessage(

            thinkingMessage,

            data.vale ||
            "VALE returned no response."

        );


    }

    catch (error) {

        console.error(
            "VALE chat error:",
            error
        );


        updateChatMessage(

            thinkingMessage,

            "VALE could not connect to the intelligence system right now. Please try again."

        );

    }

    finally {

        VALE_STATE.chatting = false;


        if (sendButton) {

            sendButton.disabled = false;

            sendButton.textContent =
                "Send";

        }


        input.focus();

    }

}


/* =========================================================
   ADD CHAT MESSAGE
========================================================= */

function addChatMessage(
    sender,
    message
) {

    const chatBox =
        document.getElementById(
            "chatBox"
        );


    if (!chatBox) {

        return null;

    }


    const messageElement =
        document.createElement(
            "div"
        );


    messageElement.className =
        "vale-message";


    const senderElement =
        document.createElement(
            "strong"
        );


    senderElement.textContent =
        sender + ": ";


    const textElement =
        document.createElement(
            "span"
        );


    textElement.textContent =
        message;


    messageElement.appendChild(
        senderElement
    );


    messageElement.appendChild(
        textElement
    );


    chatBox.appendChild(
        messageElement
    );


    chatBox.scrollTop =
        chatBox.scrollHeight;


    return messageElement;

}


/* =========================================================
   UPDATE CHAT MESSAGE
========================================================= */

function updateChatMessage(
    element,
    message
) {

    if (!element) {

        return;

    }


    const textElement =
        element.querySelector(
            "span"
        );


    if (textElement) {

        textElement.textContent =
            message;

    }

    else {

        element.textContent =
            message;

    }


    const chatBox =
        document.getElementById(
            "chatBox"
        );


    if (chatBox) {

        chatBox.scrollTop =
            chatBox.scrollHeight;

    }

}


/* =========================================================
   LOGOUT
========================================================= */

function setupLogout() {

    const logoutButton =
        document.getElementById(
            "logoutBtn"
        );


    if (!logoutButton) {

        return;

    }


    logoutButton.addEventListener(
        "click",
        event => {

            event.preventDefault();

            logout();

        }
    );

}


/* =========================================================
   LOGOUT FUNCTION
========================================================= */

function logout() {

    console.log(
        "VALE: Logging out..."
    );


    localStorage.removeItem(
        VALE_CONFIG.TOKEN_KEY
    );


    VALE_STATE.authenticated =
        false;


    VALE_STATE.username =
        null;


    VALE_STATE.online =
        false;


    window.location.href =
        VALE_CONFIG.LOGIN_PAGE;

}


/* =========================================================
   BUTTON SAFETY
========================================================= */

document.addEventListener(
    "click",
    event => {

        const button =
            event.target.closest(
                "button"
            );


        if (!button) {

            return;

        }


        if (
            button.disabled
        ) {

            event.preventDefault();

            return;

        }

    }
);


/* =========================================================
   VALE GLOBAL ACCESS
========================================================= */

window.VALE = {

    state: VALE_STATE,

    config: VALE_CONFIG,

    sendMessage,

    logout,

    authenticateUser,

    startVALEStatus

};


/* =========================================================
   SYSTEM READY
========================================================= */

console.log(
    "%cVALE AI — FRONTEND CORE READY",
    "font-weight:bold;font-size:16px;"
);

console.log(
    "VALE is waiting for authenticated intelligence."
);
