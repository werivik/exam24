document.addEventListener("DOMContentLoaded", () => {
    const allBlogsContainer = document.querySelector(".all-blogs");

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

    const updateInfo = async () => {
        const data = await fetchBlogData();
        if (data && data.data && Array.isArray(data.data)) {
            const totalPosts = data.data.length;
            const lastPosted = data.data[0].created;

            document.getElementById("totalPosts").textContent = totalPosts;
            document.getElementById("lastPosted").textContent = formatDate(lastPosted);
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

    updateInfo();

    fetch("https://v2.api.noroff.dev/blog/posts/wervik")
        .then((response) => response.json())
        .then((data) => {
            if (data && Array.isArray(data.data)) {
                data.data.forEach((blog) => {
                    const blogElement = document.createElement("div");
                    blogElement.classList.add("blog-post");
                    blogElement.innerHTML = `
                    <a href="${blog.url}" class="blog-link">
                    <img src="${blog.media.url}" alt="${blog.media.alt}">
                    <div class="post-textbox">
                        <h2 class="title"><span class="main-title">${blog.title}</span><span class="second-title">${blog.secondTitle}</span></h2>
                        <p class="published">${formatDate(blog.created)}</p>
                    </div>
                </a>
                    `;
                    allBlogsContainer.appendChild(blogElement);
                });
            } else {
                console.error("Invalid data Format received from API");
            }
        })
        .catch((error) => {
            console.error("Failed to fetch Blog Posts", error);
        });
});