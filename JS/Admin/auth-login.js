document.addEventListener("DOMContentLoaded", () => {
    console.log("Trying to sneak a peak?...");

    const loginForm = document.querySelector("form#login");

    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        console.log("Trying to Login, dont interrupt");

        const username = loginForm.username.value.trim();
        const password = loginForm.password.value.trim();

        console.log("username: ", username);
        console.log("password: ", password);

        if (username && password) {
            console.log("Heading out to get Token, One sec");
            getToken(username, password);
        } else {
            console.error("Username and password are required dude.");
        }
    });

    async function getToken(username, password) {
        try {
            const loginData = {
                email: username,
                password: password
            };

            const options = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(loginData),
            };

            const response = await fetch(`https://v2.api.noroff.dev/auth/login`, options);
            if (response.ok) {
                const data = await response.json();
                console.log(data);
                localStorage.setItem("username", data.data.name);
                localStorage.setItem("token", data.data.accessToken);

                window.location.href = "/HTML/Admin/admin-page.html";
                
            } else {
                throw new Error(response.statusText);
            }
        } catch (error) {
            console.error("Error:", error.message);
        }
    }
});