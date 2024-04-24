document.addEventListener("DOMContentLoaded", async () => {
    try {
        const blogDetailContainer = document.querySelector(".blog-detail");
        const redirectLinkDiv = document.querySelector(".redirect-link");

        if (!blogDetailContainer) {
            console.error("Element with Class 'blog-detail' not found, I am a blind computer...");
            return;
        }

        if (!redirectLinkDiv) {
            console.error("Element with Class 'redirect-link' not found, I am a blind computer...");
            return;
        }

        const fetchBlogData = async (id) => {
            try {
                const response = await fetch(`https://v2.api.noroff.dev/blog/posts/wervik/${id}`);
                if (!response.ok) {
                    throw new Error("Failed to Fetch Data from API, try again, loser");
                }

                const data = await response.json();
                return data;
            } catch (error) {
                console.error("Error fetching Data:", error);
            }
        };

        const renderBlogPostDetail = (blogPost) => {
            console.log("Rendering Blog Post Detail:", blogPost);
            const { id, title, secondTitle, created, media, body, tags } = blogPost.data;
            const formattedDate = formatDate(created);

            const blogPostElement = document.createElement("div");
            blogPostElement.classList.add("blog-post-detail");

            let mediaHTML = '';
            if (media && media.url && media.alt) {
                mediaHTML = `<img src="${media.url}" alt="${media.alt}">`;
            }

            blogPostElement.innerHTML += `
                ${mediaHTML}
                <h2 class="title">${title}</h2>
                <p class="content">${body}</p>
                <span class="published">Published: ${formattedDate}</span>
            `;

            blogDetailContainer.appendChild(blogPostElement);
        };

        const renderRedirectLinks = (tags) => {
            tags.forEach(tag => {
                if (tag === 'animal' || tag === 'edible' || tag === 'indoor' || tag === 'outdoor') {
                    const tagLink = document.createElement("a");
                    tagLink.href = getTagRedirectURL(tag);
                    tagLink.textContent = tag.charAt(0).toUpperCase() + tag.slice(1);

                    redirectLinkDiv.appendChild(tagLink);
                }
            });
        };

        const getTagRedirectURL = (tag) => {
            const redirectURLs = {
                'animal': '/HTML/animal.html',
                'edible': '/HTML/edible.html',
                'indoor': '/HTML/indoor.html',
                'outdoor': '/HTML/outdoor.html'
            };
            return redirectURLs[tag];
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

        const urlParams = new URLSearchParams(window.location.search);
        const postId = urlParams.get('id');

        if (postId) {
            const blogData = await fetchBlogData(postId);
            renderRedirectLinks(blogData.data.tags);
            renderBlogPostDetail(blogData);
        } else {
            console.error("Blog post ID not provided in the URL");
        }
    } catch (error) {
        console.error(error);
    }
});