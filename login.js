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

        console.log(
            "Waking VALE backend..."
        );

        await fetch(
            `${API_URL}/health`,
            {
                method: "GET",
                cache: "no-store"
            }
        );

        console.log(
            "VALE backend is ready."
        );

    } catch (error) {

        console.log(
            "VALE backend is waking up..."
        );

    }

}


// Start waking backend
// immediately when login page opens

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

                        body: JSON.stringify({

                            username:
                                username,

                            password:
                                password

                        })

                    }
                );


            const data =
                await response.json();


            if (data.success) {

                localStorage.setItem(
                    "vale_token",
                    data.access_token
                );


                window.location.href =
                    "index.html";


            } else {

                alert(
                    data.message ||
                    "Invalid username or password."
                );

            }


        } catch (error) {

            console.error(
                "VALE login error:",
                error
            );


            alert(
                "Unable to connect to VALE server."
            );

        }

    }
);
