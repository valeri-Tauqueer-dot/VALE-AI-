/* =========================================================
   VALE AI — LOGIN CONTROL
   Foundation Upgrade

   Responsibilities:
   - Login form handling
   - Immediate VALE wake-up UI
   - Render cold-start handling
   - Authentication
   - Token storage
   - Safe error handling
========================================================= */


/* =========================================================
   CONFIGURATION
========================================================= */

const VALE_LOGIN_CONFIG = {

    API_URL: "https://vale-backend-ye4r.onrender.com",

    LOGIN_ENDPOINT: "/login",

    TOKEN_KEY: "vale_token",

    VALE_PAGE: "index.html"

};


/* =========================================================
   DOM READY
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initializeLogin();

    }
);


/* =========================================================
   INITIALIZE LOGIN
========================================================= */

function initializeLogin() {

    const form =
        document.getElementById(
            "loginForm"
        );


    if (!form) {

        console.error(
            "VALE: loginForm not found."
        );

        return;

    }


    form.addEventListener(
        "submit",
        handleLogin
    );


    console.log(
        "VALE Login System Ready."
    );

}


/* =========================================================
   LOGIN PROCESS
========================================================= */

async function handleLogin(event) {

    event.preventDefault();


    const form =
        event.currentTarget;


    const usernameInput =
        document.getElementById(
            "username"
        );


    const passwordInput =
        document.getElementById(
            "password"
        );


    const loginButton =
        form.querySelector(
            "button[type='submit']"
        );


    const statusElement =
        document.getElementById(
            "loginStatus"
        );


    if (
        !usernameInput ||
        !passwordInput
    ) {

        showLoginStatus(
            statusElement,
            "Login system configuration error.",
            "error"
        );

        return;

    }


    const username =
        usernameInput.value.trim();


    const password =
        passwordInput.value;


    /* =====================================================
       VALIDATION
    ===================================================== */

    if (!username) {

        showLoginStatus(
            statusElement,
            "Enter your username.",
            "error"
        );

        usernameInput.focus();

        return;

    }


    if (!password) {

        showLoginStatus(
            statusElement,
            "Enter your password.",
            "error"
        );

        passwordInput.focus();

        return;

    }


    /* =====================================================
       IMMEDIATE WAKE-UP STATE
    ===================================================== */

    setLoginLoading(
        loginButton,
        true
    );


    showLoginStatus(
        statusElement,
        "VALE IS WAKING...",
        "loading"
    );


    console.log(
        "VALE: Starting authentication..."
    );


    /* =====================================================
       BACKEND REQUEST
    ===================================================== */

    try {

        const response =
            await fetch(

                VALE_LOGIN_CONFIG.API_URL +
                VALE_LOGIN_CONFIG.LOGIN_ENDPOINT,

                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body: JSON.stringify({

                        username:
                            username,

                        password:
                            password

                    })

                }

            );


        /* =================================================
           RESPONSE
        ================================================= */

        let data = null;


        try {

            data =
                await response.json();

        }

        catch {

            data = null;

        }


        /* =================================================
           INVALID LOGIN
        ================================================= */

        if (!response.ok) {

            const message =
                data?.detail ||
                data?.message ||
                "Invalid username or password.";


            showLoginStatus(
                statusElement,
                message,
                "error"
            );


            setLoginLoading(
                loginButton,
                false
            );


            return;

        }


        /* =================================================
           BACKEND RETURNED FAILURE
        ================================================= */

        if (
            data &&
            data.success === false
        ) {

            showLoginStatus(
                statusElement,
                data.message ||
                "Login failed.",
                "error"
            );


            setLoginLoading(
                loginButton,
                false
            );


            return;

        }


        /* =================================================
           TOKEN CHECK
        ================================================= */

        if (
            !data ||
            !data.access_token
        ) {

            throw new Error(
                "Authentication token was not returned."
            );

        }


        /* =================================================
           STORE TOKEN
        ================================================= */

        localStorage.setItem(

            VALE_LOGIN_CONFIG.TOKEN_KEY,

            data.access_token

        );


        console.log(
            "VALE: Authentication successful."
        );


        /* =================================================
           SUCCESS / WAKE STATE
        ================================================= */

        showLoginStatus(
            statusElement,
            "VALE ONLINE • ACCESS GRANTED",
            "success"
        );


        if (loginButton) {

            loginButton.textContent =
                "ENTERING VALE...";

        }


        /* =================================================
           SHORT TRANSITION
           Gives user visual confirmation instead of
           an abrupt page switch.
        ================================================= */

        setTimeout(
            () => {

                window.location.href =
                    VALE_LOGIN_CONFIG.VALE_PAGE;

            },
            350
        );


    }

    catch (error) {

        console.error(
            "VALE Login Error:",
            error
        );


        showLoginStatus(

            statusElement,

            "VALE is taking longer than expected to wake. Please try again.",

            "error"

        );


        setLoginLoading(
            loginButton,
            false
        );

    }

}


/* =========================================================
   LOGIN LOADING STATE
========================================================= */

function setLoginLoading(
    button,
    loading
) {

    if (!button) {

        return;

    }


    if (loading) {

        button.disabled =
            true;


        button.dataset.originalText =
            button.textContent;


        button.textContent =
            "VALE IS WAKING...";


        button.style.opacity =
            "0.75";


        button.style.cursor =
            "wait";

    }

    else {

        button.disabled =
            false;


        button.textContent =
            button.dataset.originalText ||
            "LOGIN";


        button.style.opacity =
            "";


        button.style.cursor =
            "";

    }

}


/* =========================================================
   STATUS MESSAGE
========================================================= */

function showLoginStatus(
    element,
    message,
    type
) {

    if (!element) {

        /*
         If the HTML doesn't currently have
         #loginStatus, don't break login.
        */

        console.log(
            `VALE LOGIN [${type}]: ${message}`
        );

        return;

    }


    element.textContent =
        message;


    element.className =
        `login-status ${type}`;


    element.style.display =
        "block";

}


/* =========================================================
   PREVENT DOUBLE SUBMISSION
========================================================= */

window.addEventListener(
    "beforeunload",
    () => {

        const token =
            localStorage.getItem(
                VALE_LOGIN_CONFIG.TOKEN_KEY
            );


        if (token) {

            console.log(
                "VALE authentication session preserved."
            );

        }

    }
);


/* =========================================================
   VALE LOGIN READY
========================================================= */

console.log(
    "%cVALE AI — LOGIN SYSTEM READY",
    "font-weight:bold;font-size:16px;"
);
