/* =========================================================
   VALE AI — LOGIN CONTROL
   FOUNDATION / COLD-START UPGRADE

   Responsibilities:
   - Login form handling
   - Render cold-start wake-up
   - Immediate VALE visual state
   - Authentication
   - JWT token storage
   - Safe error handling
   - Double-submit protection
   - Backend timeout protection
========================================================= */


/* =========================================================
   CONFIGURATION
========================================================= */

const VALE_LOGIN_CONFIG = {

    API_URL:
        "https://vale-backend-ye4r.onrender.com",

    LOGIN_ENDPOINT:
        "/login",

    HEALTH_ENDPOINT:
        "/health",

    TOKEN_KEY:
        "vale_token",

    VALE_PAGE:
        "index.html",

    /*
       Maximum time allowed for login request.

       Render free services can take time to wake.
       We give the backend enough time without
       allowing the browser to appear frozen forever.
    */
    LOGIN_TIMEOUT:
        45000

};


/* =========================================================
   VALE SYSTEM STATE
========================================================= */

let valeBackendWaking = false;
let valeLoginInProgress = false;


/* =========================================================
   DOM READY
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initializeLogin();

        /*
           Start waking Render immediately.

           This happens in the background and does NOT
           block the user from using the login page.
        */
        wakeValeBackend();

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
   BACKEND WAKE-UP
========================================================= */

async function wakeValeBackend() {

    if (valeBackendWaking) {

        return;

    }


    valeBackendWaking = true;


    console.log(
        "VALE: Waking intelligence backend..."
    );


    try {

        const response =
            await fetch(

                VALE_LOGIN_CONFIG.API_URL +
                VALE_LOGIN_CONFIG.HEALTH_ENDPOINT,

                {
                    method: "GET",

                    cache: "no-store"
                }

            );


        if (response.ok) {

            console.log(
                "VALE: Backend is awake."
            );

        }

        else {

            console.warn(
                "VALE: Backend responded with status:",
                response.status
            );

        }

    }

    catch (error) {

        /*
           Do NOT show an error here.

           The login request will perform its own
           connection attempt.

           This prevents a background wake-up failure
           from unnecessarily worrying the user.
        */

        console.warn(
            "VALE: Background wake-up did not complete.",
            error
        );

    }

    finally {

        valeBackendWaking = false;

    }

}


/* =========================================================
   LOGIN PROCESS
========================================================= */

async function handleLogin(event) {

    event.preventDefault();


    /*
       Prevent accidental double-clicks.
    */

    if (valeLoginInProgress) {

        return;

    }


    valeLoginInProgress = true;


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


    /* =====================================================
       CONFIGURATION CHECK
    ===================================================== */

    if (
        !usernameInput ||
        !passwordInput
    ) {

        showLoginStatus(

            statusElement,

            "Login system configuration error.",

            "error"

        );


        valeLoginInProgress = false;

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

        valeLoginInProgress = false;

        return;

    }


    if (!password) {

        showLoginStatus(

            statusElement,

            "Enter your password.",

            "error"

        );


        passwordInput.focus();

        valeLoginInProgress = false;

        return;

    }


    /* =====================================================
       IMMEDIATE VALE WAKE STATE
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
        "VALE: Authentication sequence started."
    );


    /*
       Give the interface a moment to render the
       loading state before the network request begins.

       This makes the transition feel intentional
       instead of frozen.
    */

    await nextFrame();


    /* =====================================================
       AUTHENTICATION REQUEST
    ===================================================== */

    try {

        const controller =
            new AbortController();


        const timeout =
            setTimeout(

                () => {

                    controller.abort();

                },

                VALE_LOGIN_CONFIG.LOGIN_TIMEOUT

            );


        showLoginStatus(

            statusElement,

            "CONNECTING TO VALE CORE...",

            "loading"

        );


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

                    }),

                    signal:
                        controller.signal

                }

            );


        clearTimeout(timeout);


        /* =================================================
           READ RESPONSE
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


            valeLoginInProgress = false;

            return;

        }


        /* =================================================
           BACKEND FAILURE
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


            valeLoginInProgress = false;

            return;

        }


        /* =================================================
           TOKEN VALIDATION
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
           STORE AUTHENTICATION TOKEN
        ================================================= */

        localStorage.setItem(

            VALE_LOGIN_CONFIG.TOKEN_KEY,

            data.access_token

        );


        console.log(
            "VALE: Authentication successful."
        );


        /* =================================================
           SUCCESS STATE
        ================================================= */

        showLoginStatus(

            statusElement,

            "VALE ONLINE • ACCESS GRANTED",

            "success"

        );


        if (loginButton) {

            loginButton.disabled =
                true;


            loginButton.textContent =
                "ENTERING VALE...";

            loginButton.style.opacity =
                "1";

            loginButton.style.cursor =
                "default";

        }


        /* =================================================
           ENTER VALE
        ================================================= */

        setTimeout(

            () => {

                window.location.href =
                    VALE_LOGIN_CONFIG.VALE_PAGE;

            },

            500

        );


    }

    catch (error) {

        console.error(
            "VALE Login Error:",
            error
        );


        /* =================================================
           TIMEOUT / COLD START
        ================================================= */

        if (
            error.name ===
            "AbortError"
        ) {

            showLoginStatus(

                statusElement,

                "VALE CORE IS TAKING LONGER TO WAKE. Please try again.",

                "error"

            );

        }

        else {

            showLoginStatus(

                statusElement,

                "Unable to connect to VALE CORE. Please try again.",

                "error"

            );

        }


        setLoginLoading(

            loginButton,

            false

        );


        valeLoginInProgress = false;

    }

}


/* =========================================================
   LOGIN BUTTON STATE
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


        /*
           Save original button text only once.
        */

        if (
            !button.dataset.originalText
        ) {

            button.dataset.originalText =
                button.textContent;

        }


        button.textContent =
            "VALE IS WAKING...";


        button.style.opacity =
            "0.8";


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
   RENDER-FRIENDLY FRAME
========================================================= */

function nextFrame() {

    return new Promise(

        resolve => {

            requestAnimationFrame(
                () => resolve()
            );

        }

    );

}


/* =========================================================
   SESSION PRESERVATION
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

    "%cVALE AI — LOGIN CONTROL ONLINE",

    "font-weight:bold;font-size:16px;"

);
