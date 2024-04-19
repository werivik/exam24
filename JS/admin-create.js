document.addEventListener("DOMContentLoaded", () => {
    const newBlogForm = document.getElementById("newBlogForm");

    newBlogForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const title = document.getElementById("title").value.trim();
        const body = document.getElementById("body").value.trim();
        const tags = document.getElementById("tags").value.trim().split(",");
        const mediaUrl = document.getElementById("mediaUrl").value.trim();
        const mediaAlt = document.getElementById("mediaAlt").value.trim();

        try {
            const token = localStorage.getItem("token");

            if (!token) {
                throw new Error("No access token found. Please login again.");
            }

            const postData = {
                title: title,
                body: body,
                tags: tags,
                media: {
                    url: mediaUrl,
                    alt: mediaAlt
                }
            };

            const options = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(postData)
            };

            const response = await fetch("https://v2.api.noroff.dev/blog/posts/wervik", options);

            if (response.ok) {
                alert("Blog Post Created Successfully <3");
                window.location.href = "/HTML/admin-all.html";
            } else {
                const errorData = await response.json();
                throw new Error(errorData.errors[0].message);
            }
        } catch (error) {
            console.error(error.message);
            alert("Failed to Create Blog Post. Please try again.");
        }
    });
});