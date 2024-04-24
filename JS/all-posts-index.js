document.addEventListener("DOMContentLoaded", () => {
    const allPostsContainer = document.querySelector(".all-posts-index");
    if (!allPostsContainer) {
        console.error("Element with class 'all-posts-index' not found.");
        return;
    }

    const fetchBlogData = async () => {
        try {
            const response = await fetch("https://v2.api.noroff.dev/blog/posts/wervik");
            if (!response.ok) {
                throw new Error("Failed to Fetch Data from API, try again, loser");
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    updateInfo();

    fetch("https://v2.api.noroff.dev/blog/posts/wervik")
        .then((response) => response.json())
        .then((data) => {
            if (data && Array.isArray(data.data)) {
                data.data.forEach((post) => {
                    const postElement = document.createElement("div");
                    postElement.classList.add("all-post-blog");
                    postElement.innerHTML = `
                        <a href="/HTML/blog-post-detail.html?id=${post.id}" class="post-link">
                            <img src="${post.media.url}" alt="${post.media.alt}">
                            <div class="post-textbox">
                                <h2 class="title">${post.title}</h2>
                                <p class="published">${formatDate(post.created)}</p>
                            </div>
                        </a>
                    `;
                    if(allPostsContainer) {
                        allPostsContainer.appendChild(postElement);
                    } else {
                        console.error("Element with class 'all-posts-index' not found.");
                    }
                });
            } else {
                console.error("Invalid data Format received from API");
            }
        })
        .catch((error) => {
            console.error("Failed to fetch Posts", error);
        });
});