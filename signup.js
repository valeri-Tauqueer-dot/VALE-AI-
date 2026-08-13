const signupBtn = document.getElementById("signupBtn");

signupBtn.addEventListener("click", async () => {

    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword =
        document.getElementById("confirmPassword").value;

    // Check fields
    if (!username || !email || !password || !confirmPassword) {
        alert("Please fill all required fields.");
        return;
    }

    // Check password confirmation
    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }

    try {

        const response = await fetch(
            "https://vale-backend-ye4r.onrender.com/signup",
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

        const data = await response.json();

        console.log("VALE signup response:", data);

        if (response.ok && data.success === true) {

            alert("Account Created Successfully!");

            window.location.href = "login.html";

        } else {

            alert(
                data.message ||
                data.detail ||
                "Account creation failed."
            );
        }

    } catch (error) {

        console.error("VALE signup error:", error);

        alert(
            "Unable to connect to VALE server.\n\n" +
            "Check that the VALE backend is running."
        );
    }

});