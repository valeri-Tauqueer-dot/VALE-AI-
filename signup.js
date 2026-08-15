// ==========================
// VALE SIGNUP SYSTEM
// ==========================

const API_URL = "https://vale-backend-ye4r.onrender.com";

const signupForm = document.getElementById("signupForm");


// ==========================
// WAKE VALE BACKEND
// ==========================

async function wakeVALE() {

    try {

        console.log("Waking VALE backend...");

        await fetch(`${API_URL}/health`, {
            method: "GET",
            cache: "no-store"
        });

        console.log("VALE backend is ready.");

    } catch (error) {

        console.log(
            "VALE backend is waking up..."
        );

    }

}


// Start waking backend
// when signup page opens

wakeVALE();


// ==========================
// SIGNUP
// ==========================

signupForm.addEventListener("submit", async (e) => {

    e.preventDefault();


    // ==========================
    // GET FORM DATA
    // ==========================

    const username =
        document.getElementById("username").value.trim();

    const email =
        document.getElementById("email").value.trim();

    const password =
        document.getElementById("password").value;

    const confirmPassword =
        document.getElementById("confirmPassword").value;


    // ==========================
    // VALIDATION
    // ==========================

    if (
        !username ||
        !email ||
        !password ||
        !confirmPassword
    ) {

        alert(
            "Please fill all required fields."
        );

        return;
    }


    if (password !== confirmPassword) {

        alert(
            "Passwords do not match."
        );

        return;
    }


    // ==========================
    // PREVENT DOUBLE CLICK
    // ==========================

    const submitButton =
        signupForm.querySelector(
            'button[type="submit"]'
        );


    if (submitButton) {

        submitButton.disabled = true;

        submitButton.textContent =
            "Creating Account...";

    }


    try {

        // ==========================
        // SEND SIGNUP REQUEST
        // ==========================

        const response = await fetch(
            `${API_URL}/signup`,
            {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    username: username,

                    email: email,

                    password: password

                })

            }
        );


        const data =
            await response.json();


        console.log(
            "VALE signup response:",
            data
        );


        // ==========================
        // SUCCESS
        // ==========================

        if (
            response.ok &&
            data.success === true
        ) {

            alert(
                "Account Created Successfully!"
            );


            window.location.href =
                "login.html";


            return;

        }


        // ==========================
        // ERROR
        // ==========================

        alert(

            data.message ||

            data.detail ||

            "Account creation failed."

        );


        // Allow another attempt

        if (submitButton) {

            submitButton.disabled = false;

            submitButton.textContent =
                "Create Account";

        }


    } catch (error) {

        console.error(
            "VALE signup error:",
            error
        );


        alert(
            "Unable to connect to VALE server.\n\n" +
            "VALE server may still be waking up. " +
            "Please wait a moment and try again."
        );


        // Allow another attempt

        if (submitButton) {

            submitButton.disabled = false;

            submitButton.textContent =
                "Create Account";

        }

    }

});
