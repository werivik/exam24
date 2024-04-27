document.addEventListener("DOMContentLoaded", async () => {
    const allBlogsContainer = document.querySelector(".all-blogs");

    if (!allBlogsContainer) {
        console.error("Element with class 'all-blogs' not found.");
        return;
    }

    const alphabeticalFilter = document.getElementById("alphabeticalFilter");
    const applyFiltersButton = document.getElementById("applyFiltersButton");

    if (!alphabeticalFilter || !applyFiltersButton) {
        console.error("Date, alphabetical filter, or apply filters button element not found.");
        return;
    }

    const applyFilters = () => {
        const selectedAlphabeticalFilter = alphabeticalFilter.value;

        let sortedPosts = Array.from(document.querySelectorAll(".blog-post"));

        if (selectedAlphabeticalFilter === "ascending") {
            sortedPosts.sort((a, b) => {
                const titleA = a.querySelector(".main-title").textContent.toLowerCase();
                const titleB = b.querySelector(".main-title").textContent.toLowerCase();
                
                return titleA.localeCompare(titleB);
            });
        } 
        
        else if (selectedAlphabeticalFilter === "descending") {
            sortedPosts.sort((a, b) => {
                const titleA = a.querySelector(".main-title").textContent.toLowerCase();
                const titleB = b.querySelector(".main-title").textContent.toLowerCase();
                
                return titleB.localeCompare(titleA);
            });
        }

        renderSortedPosts(sortedPosts);
    };

    applyFiltersButton.addEventListener("click", applyFilters);

    const fetchAndRenderBlogData = async () => {
        try {
            const data = await fetchBlogData();
            
            if (data && Array.isArray(data.data)) {
                renderBlogPosts(data.data);
                updateInfo(data.data);
            } 
            
            else {
                console.error("Invalid data format received from API");
            }
        } 
        
        catch (error) {
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
        } 
        
        catch (error) {
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
        } 
        
        else {
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