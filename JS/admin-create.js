document.addEventListener("DOMContentLoaded", () => {
    const newBlogForm = document.getElementById("newBlogForm");

    newBlogForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const mainTitle = document.getElementById("mainTitle").value.trim();
        const secondTitle = document.getElementById("secondTitle").value.trim();
        const blogText = document.getElementById("blogText").value.trim();
        const tags = document.getElementById("tags").value.trim().split(",");
        const pictureUrl = document.getElementById("pictureUrl").value.trim();
        const pictureAlt = document.getElementById("pictureAlt").value.trim();

        try {
            const token = localStorage.getItem("token");

            if (!token) {
                throw new Error("No access token found. Please login again.");
            }

            const postData = {
                mainTitle: mainTitle,
                secondTitle: secondTitle,
                blogText: blogText,
                tags: tags,
                media: {
                    url: pictureUrl,
                    alt: pictureAlt
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