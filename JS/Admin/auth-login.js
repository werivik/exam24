document.addEventListener("DOMContentLoaded", () => {
    console.log("Trying to sneak a peak?...");

    const loginForm = document.querySelector("form#login");
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const loginButton = document.querySelector(".login-button");

    const checkFormValidity = () => {
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();
        
        return username && password;
    };

    const updateLoginButtonOpacity = () => {
        if (checkFormValidity()) {
            loginButton.style.opacity = 1; 
        } 
        
        else {
            loginButton.style.opacity = 0.5; 
        }
    };

    loginButton.style.opacity = 0.5;

    usernameInput.addEventListener("input", updateLoginButtonOpacity);
    passwordInput.addEventListener("input", updateLoginButtonOpacity);

    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        console.log("Trying to Login, don't interrupt");

        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        console.log("username: ", username);
        console.log("password: ", password);

        if (checkFormValidity()) {
            console.log("Heading out to get Token, One sec");
            getToken(username, password);
        } 
        
        else {
            console.error("Username and password are required.");
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

                window.location.href = "admin-page.html";
                
            } 
            
            else {
                throw new Error(response.statusText);
            }
        } 
        
        catch (error) {
            console.error("Error:", error.message);
        }
    }
});