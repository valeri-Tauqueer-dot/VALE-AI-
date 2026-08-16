// ==========================
// VALE LOGIN SYSTEM
// ==========================

const API_URL =
    "https://vale-backend-ye4r.onrender.com";

const loginForm =
    document.getElementById("loginForm");


// ==========================
// WAKE VALE BACKEND
// ==========================

async function wakeVALE() {

    try {

        console.log("Waking VALE backend...");

        await fetch(
            `${API_URL}/health`,
            {
                method: "GET",
                cache: "no-store"
            }
        );

        console.log("VALE backend is ready.");

    } catch (error) {

        console.log(
            "VALE backend is waking up..."
        );

    }

}

wakeVALE();


// ==========================
// LOGIN
// ==========================

loginForm.addEventListener(
    "submit",
    async (e) => {

        e.preventDefault();


        const username =
            document
                .getElementById("username")
                .value
                .trim();


        const password =
            document
                .getElementById("password")
                .value;


        if (!username || !password) {

            alert(
                "Please enter username and password."
            );

            return;

        }


        // ==========================
        // PREVENT DOUBLE CLICK
        // ==========================

        const loginButton =
            loginForm.querySelector(
                'button[type="submit"]'
            );


        if (loginButton) {

            loginButton.disabled = true;

            loginButton.textContent =
                "Connecting...";

        }


        // ==========================
        // START VALE 3D CORE
        // ==========================

        if (
            window.VALECore
        ) {

            window.VALECore.start();

            window.VALECore.setStatus(
                "AUTHENTICATING USER"
            );

        }


        try {

            const response =
                await fetch(
                    `${API_URL}/login`,
                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body:
                            JSON.stringify({

                                username:
                                    username,

                                password:
                                    password

                            })

                    }
                );


            const data =
                await response.json();


            // ==========================
            // LOGIN SUCCESS
            // ==========================

            if (
                data.success
            ) {

                if (
                    window.VALECore
                ) {

                    window.VALECore.setStatus(
                        "ACCESS GRANTED"
                    );

                }


                localStorage.setItem(
                    "vale_token",
                    data.access_token
                );


                // Give the Core a tiny
                // moment to show success

                setTimeout(
                    () => {

                        window.location.href =
                            "index.html";

                    },
                    700
                );


                return;

            }


            // ==========================
            // LOGIN FAILED
            // ==========================

            if (
                window.VALECore
            ) {

                window.VALECore.stop();

            }


            if (loginButton) {

                loginButton.disabled =
                    false;

                loginButton.textContent =
                    "Login";

            }


            alert(
                data.message ||
                "Invalid username or password."
            );

        }


        catch (error) {

            console.error(
                "VALE login error:",
                error
            );


            if (
                window.VALECore
            ) {

                window.VALECore.stop();

            }


            if (loginButton) {

                loginButton.disabled =
                    false;

                loginButton.textContent =
                    "Login";

            }


            alert(
                "Unable to connect to VALE server."
            );

        }

    }
);