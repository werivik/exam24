document.addEventListener("DOMContentLoaded", async () => {
    const searchInput = document.getElementById("searchInput");
    const searchResults = document.getElementById("searchResults");

    searchResults.style.display = "none";

    searchInput.addEventListener("input", async () => {
        const searchTerm = searchInput.value.trim().toLowerCase();

        if (searchTerm === "") {
            searchResults.innerHTML = "";
            searchResults.style.display = "none";
            return;
        }

        const data = await fetchBlogData();

        if (!data || !Array.isArray(data.data)) {
            console.error("Invalid data format received from API");
            return;
        }

        const originalPosts = data.data;
        const filteredPosts = originalPosts.filter(post => post.title.toLowerCase().includes(searchTerm));

        renderSearchResults(filteredPosts);
    });

    function renderSearchResults(posts) {
        searchResults.innerHTML = "";

        posts.forEach(post => {
            const option = document.createElement("h2");
            option.classList.add("search-result");
            option.textContent = post.title;
            option.addEventListener("click", () => {
                navigateToPost(post.id);
            });

            searchResults.appendChild(option);
        });

        searchResults.style.display = "block";
    }

    async function fetchBlogData() {
        try {
            const response = await fetch("https://v2.api.noroff.dev/blog/posts/wervik");

            if (!response.ok) {
                throw new Error("Failed to fetch data from API");
            }
            const data = await response.json();

            return data;
        } 
        
        catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    function navigateToPost(postId) {
        window.location.href = `/blog-post-detail.html?id=${postId}`;
    }

    document.addEventListener("click", (event) => {
        if (!event.target.closest(".searchbar-header")) {
            searchResults.style.display = "none";
        }
    });
});