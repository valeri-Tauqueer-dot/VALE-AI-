const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const username = document.getElementById("username").value;

    const password = document.getElementById("password").value;

    try {

        const response = await fetch(
            "https://vale-backend-ye4r.onrender.com/login",
            {

                method: "POST",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify({

                    username: username,

                    password: password

                })

            }
        );

        const data = await response.json();

        if(data.success){

            localStorage.setItem(
    "vale_token",
    data.access_token
);

window.location.href = "index.html";

        }else{

            alert(data.message);

        }

    } catch {

        alert("Unable to connect to VALE server.");

    }

});