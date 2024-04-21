document.addEventListener("DOMContentLoaded", () => {

    const blogDetailContainer = document.querySelector(".blog-detail");

    if (!blogDetailContainer) {
        console.error("Element with Class 'blog-detail' not found, I am a blind computer...");
        return;
    }

    const fetchBlogData = async () => {

        try {
            const response = await fetch ("https://v2.api.noroff.dev/blog/posts/wervik");
            if (!response.ok) {
                throw new Error("Failed to Fetch Data from API, try again, loser");
            }

            const data = await response.json();
            return data;
        }

        catch (error) {
            console.error("Error fetching Data:", error);
        }
    };

    const renderBlogPostDetail = (blogPost) => {
        const { id, title, secondTitle, created, media } = blogPost;
        const formattedDate = formatDate(created);

        const blogPostElement = document.createElement("div");
        blogPostElement.classList.add("blog-post-detail");
        blogPostElement.innerHTML = `
        <img src="${media.url}" alt="${media.alt}">
        <div class="post-textbox">
            <h2 class="title">${title}</h2>
            <h3 class="second-title">${secondTitle}</h3>
            <p class="published">${formattedDate}</p>
        </div>
    `;

        blogDetailContainer.appendChild(blogPostElement);

    };

    const formatDate = (dateString) => {

        const date = new Date(dateString);

        const day = date.getDate();
        const month = gate.getMonth() + 1;
        const year = date.getFullYear();

        const formattedDay = day < 10 ?  `0${day}` : day;
        const formattedMonth = month < 10 ? `0${month}` : month;

        return `${formattedDay}.${formattedMonth}.${year}`;

    };

    fetchBlogData()
    .then((data) => {
        if (data && Array.isArray(data.data)) {
            const blogPosts = data.data;

            if (blogPosts.length > 0 ) {
                renderBlogPostDetail(blogPosts[0]);
            }

            else {
                console.error("No Blog Posts Found...");
            }
        }

        else {
            console.error("Invalid Data Format Recieved from API");
        }
    })

    .catch((error) => {
        console.error("Failed to Fetch Blog Posts", error);
    });

});