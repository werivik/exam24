document.addEventListener("DOMContentLoaded", async () => {
    const newlyPostedContainer = document.querySelector(".newly-posted");

    const fetchBlogData = async () => {
        try {
            const response = await fetch("https://v2.api.noroff.dev/blog/posts/wervik");
            if (!response.ok) {
                throw new Error("Failed to Fetch Data from API");
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching data:", error);
            return null;
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        const formattedDay = day < 10 ? `0${day}` : day;
        const formattedMonth = month < 10 ? `0${month}` : month;
        return `${formattedDay}.${formattedMonth}.${year}`;
    };

    const data = await fetchBlogData();

    if (data && data.data && Array.isArray(data.data)) {
        const posts = data.data.slice(0, 5);
        posts.forEach((post) => {
            const postElement = document.createElement("div");
            postElement.classList.add("new-post");
            postElement.innerHTML = `
                <a href="blog-post-detail.html?id=${post.id}" class="blog-link">
                    <img src="${post.media.url}" alt="${post.media.alt}">
                    <div class="post-textbox">
                        <h2 class="title">${post.title}</h2>
                        <p class="published">${formatDate(post.created)}</p>
                    </div>
                </a>
            `;
            newlyPostedContainer.appendChild(postElement);
        });
    } else {
        console.error("Invalid data format received from API");
    }
});