document.addEventListener("DOMContentLoaded", () => {
    const allPostsContainer = document.querySelector(".all-posts-index");
    const searchInput = document.getElementById("searchbarInput");
    const noPostsMessage = document.createElement("p");
    noPostsMessage.textContent = "Sorry, Could not Find Blog Post";
    noPostsMessage.style.display = "none";
    allPostsContainer.parentNode.insertBefore(noPostsMessage, allPostsContainer.nextSibling);

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
        } 
        
        catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    updateInfo();

    fetchBlogData()
        .then(data => {

            if (data && Array.isArray(data.data)) {
                const originalPosts = data.data;

                searchInput.addEventListener("input", () => {
                    const searchTerm = searchInput.value.toLowerCase();
                    const filteredPosts = originalPosts.filter(post => post.title.toLowerCase().includes(searchTerm));
                    
                    renderPosts(filteredPosts);
                    
                    if (filteredPosts.length === 0) {
                        noPostsMessage.style.display = "block";
                    } 
                    
                    else {
                        noPostsMessage.style.display = "none";
                    }
                });

                renderPosts(originalPosts);
            } 
            
            else {
                console.error("Invalid data Format received from API");
            }
        })
        
        .catch(error => {
            console.error("Failed to fetch Posts", error);
        });

    function renderPosts(posts) {
        allPostsContainer.innerHTML = "";
        posts.forEach(post => {
            const postElement = document.createElement("div");
            postElement.classList.add("all-post-blog");
            
            postElement.innerHTML = `
                <a href="/blog-post-detail.html?id=${post.id}" class="post-link">
                    <img src="${post.media.url}" alt="${post.media.alt}">
                    <div class="post-textbox">
                        <h2 class="title">${post.title}</h2>
                        <p class="published">${formatDate(post.created)}</p>
                    </div>
                </a>
            `;
            allPostsContainer.appendChild(postElement);
        });
    }

});