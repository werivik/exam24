document.addEventListener("DOMContentLoaded", async () => {
    const allBlogsContainer = document.querySelector(".all-blogs");
    if (!allBlogsContainer) {
        console.error("Element with class 'all-blogs' not found.");
        return;
    }

    const dateFilter = document.getElementById("dateFilter");
    const alphabeticalFilter = document.getElementById("alphabeticalFilter");
    const applyFiltersButton = document.getElementById("applyFiltersButton");

    if (!dateFilter || !alphabeticalFilter || !applyFiltersButton) {
        console.error("Date, alphabetical filter, or apply filters button element not found.");
        return;
    }

    const applyFilters = () => {
        const selectedDateFilter = dateFilter.value;
        const selectedAlphabeticalFilter = alphabeticalFilter.value;

        const dateSortedPosts = sortBlogPostsByDate(selectedDateFilter);

        const sortedPosts = sortBlogPostsAlphabetically(selectedAlphabeticalFilter, dateSortedPosts);

        renderSortedPosts(sortedPosts);
    };

    applyFiltersButton.addEventListener("click", applyFilters);

    dateFilter.addEventListener("change", applyFilters);
    alphabeticalFilter.addEventListener("change", applyFilters);

    const fetchAndRenderBlogData = async () => {
        try {
            const data = await fetchBlogData();
            if (data && Array.isArray(data.data)) {
                renderBlogPosts(data.data);
                updateInfo(data.data);
            } else {
                console.error("Invalid data format received from API");
            }
        } catch (error) {
            console.error("Failed to fetch blog posts:", error);
        }
    };

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

    const updateInfo = (blogData) => {
        const totalPosts = blogData.length;
        const lastPosted = blogData[0].created;

        const totalPostsElement = document.getElementById("totalPosts");
        const lastPostedElement = document.getElementById("lastPosted");

        if (totalPostsElement && lastPostedElement) {
            totalPostsElement.textContent = totalPosts;
            lastPostedElement.textContent = formatDate(lastPosted);
        } else {
            console.error("Elements with IDs 'totalPosts' and 'lastPosted' not found.");
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

    const sortBlogPostsByDate = (sortBy) => {
        const blogPosts = Array.from(document.querySelectorAll(".blog-post"));
        return blogPosts.sort((a, b) => {
            const dateA = new Date(a.querySelector(".published").textContent);
            const dateB = new Date(b.querySelector(".published").textContent);
            return sortBy === "latest" ? dateB - dateA : dateA - dateB;
        });
    };

    const sortBlogPostsAlphabetically = (sortBy, posts) => {
        return posts.sort((a, b) => {
            const titleA = a.querySelector(".main-title").textContent.toLowerCase();
            const titleB = b.querySelector(".main-title").textContent.toLowerCase();
            return sortBy === "ascending" ? titleA.localeCompare(titleB) : titleB.localeCompare(titleA);
        });
    };

    const renderBlogPosts = (blogData) => {
        blogData.forEach((blog) => {
            const blogElement = document.createElement("div");
            blogElement.classList.add("blog-post");
            blogElement.innerHTML = `
                <a href="/HTML/blog-post-detail.html?id=${blog.id}" class="blog-link">
                    <img src="${blog.media.url}" alt="${blog.media.alt}">
                    <div class="post-textbox">
                        <h2 class="title"><span class="main-title">${blog.title}</span></h2>
                        <p class="published">${formatDate(blog.created)}</p>
                    </div>
                </a>
            `;
            allBlogsContainer.appendChild(blogElement);
        });
    };

    const renderSortedPosts = (sortedPosts) => {
        allBlogsContainer.innerHTML = "";
        sortedPosts.forEach((post) => {
            allBlogsContainer.appendChild(post);
        });
    };

    fetchAndRenderBlogData();
});