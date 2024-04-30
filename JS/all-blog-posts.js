document.addEventListener("DOMContentLoaded", async () => {
    const allBlogsContainer = document.querySelector(".all-blogs");
    const searchInput = document.getElementById("searchInput");
    const noPostsMessage = document.createElement("p");
    noPostsMessage.textContent = "Sorry, Could not Find Blog Post";
    noPostsMessage.style.display = "none";
    allBlogsContainer.parentNode.insertBefore(noPostsMessage, allBlogsContainer.nextSibling);

    if (!allBlogsContainer) {
        console.error("Element with class 'all-blogs' not found.");
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
        } 
        
        catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    fetchBlogData()
        .then(data => {
            if (data && Array.isArray(data.data)) {
                const originalPosts = data.data;

                const renderFilteredPosts = () => {
                    const selectedAlphabeticalFilter = document.getElementById("alphabeticalFilter").value;
                    let filteredPosts = [...originalPosts];

                    if (selectedAlphabeticalFilter === "ascending") {
                        filteredPosts.sort((a, b) => a.title.localeCompare(b.title));
                    } else if (selectedAlphabeticalFilter === "descending") {
                        filteredPosts.sort((a, b) => b.title.localeCompare(a.title));
                    }

                    const searchTerm = searchInput.value.toLowerCase();
                    filteredPosts = filteredPosts.filter(post => post.title.toLowerCase().includes(searchTerm));
                    
                    renderPosts(filteredPosts);
                    
                    if (filteredPosts.length === 0) {
                        noPostsMessage.style.display = "block";
                    } else {
                        noPostsMessage.style.display = "none";
                    }
                };

                document.getElementById("applyFiltersButton").addEventListener("click", renderFilteredPosts);

                searchInput.addEventListener("input", renderFilteredPosts);

                renderPosts(originalPosts);
            } else {
                console.error("Invalid data Format received from API");
            }
        })
        .catch(error => {
            console.error("Failed to fetch Posts", error);
        });

    function renderPosts(posts) {
        allBlogsContainer.innerHTML = "";
        posts.forEach(post => {
            const blogElement = document.createElement("div");
            blogElement.classList.add("blog-post");
            blogElement.innerHTML = `
                <a href="/HTML/blog-post-detail.html?id=${post.id}" class="blog-link">
                    <img src="${post.media.url}" alt="${post.media.alt}">
                    <div class="post-textbox">
                        <h2 class="title"><span class="main-title">${post.title}</span></h2>
                        <p class="published">${formatDate(post.created)}</p>
                    </div>
                </a>
            `;
            allBlogsContainer.appendChild(blogElement);
        });
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        const formattedDay = day < 10 ? `0${day}` : day;
        const formattedMonth = month < 10 ? `0${month}` : month;
        
        return `${formattedDay}.${formattedMonth}.${year}`;
    };
});