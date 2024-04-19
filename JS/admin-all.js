document.addEventListener("DOMContentLoaded", () => {
    const allBlogsContainer = document.querySelector(".all-blogs");

    fetch("https://v2.api.noroff.dev/blog/posts/wervik")
    .then(response => response.json())
    .then(data => {
        if (data && Array.isArray(data.data)) {

            data.data.forEach(blog => {
                const blogElement = document.createElement("div");
                blogElement.classList.add("blog-item");
                blogElement.innerHTML = `
                <h3>${blog.title}</h3>
                <p>${blog.body}</p>
                <p>Tags: ${blog.tags.join(", ")}</p>
                <img src="${blog.media.url}" alt="${blog.media.alt}">
                `;
                allBlogsContainer.appendChild(blogElement);

            });
        }

        else {
            console.error("Invalid data Format recieved from API");
        }
    })

    .catch(error => {
        console.error("Failed to fetch Blog Posts", error);
    });
});