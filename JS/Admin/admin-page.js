document.addEventListener("DOMContentLoaded", () => {
    const allBlogsContainer = document.querySelector(".all-blogs");
    const searchInput = document.getElementById("searchInput");

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

    const updateInfo = async () => {
        const data = await fetchBlogData();
        if (data && data.data && Array.isArray(data.data)) {
            const totalPosts = data.data.length;
            const lastPosted = data.data[0].created;

            const totalPostsElement = document.getElementById("totalPosts");
            const lastPostedElement = document.getElementById("lastPosted");

            if (totalPostsElement && lastPostedElement) {
                totalPostsElement.textContent = totalPosts;
                lastPostedElement.textContent = formatDate(lastPosted);
            } 
            
            else {
                console.error("Elements with IDs 'totalPosts' and 'lastPosted' not found.");
            }
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

    searchInput.addEventListener("input", () => {

        renderFilteredPosts();
    });

    const renderPosts = (posts) => {
        allBlogsContainer.innerHTML = "";
        posts.forEach(post => {

            const blogElement = document.createElement("div");
            blogElement.classList.add("blog-post");
            blogElement.innerHTML = `
                <a href="admin-blog-post.html?id=${post.id}" class="blog-link">
                    <img src="${post.media.url}" alt="${post.media.alt}">
                    <div class="post-textbox">
                        <h2 class="title"><span class="main-title">${post.title}</span></h2>
                        <p class="published">Published: ${formatDate(post.created)}</p>
                    </div>
                </a>
            `;

            allBlogsContainer.appendChild(blogElement);
        });
    };

    const renderFilteredPosts = () => {
        fetchBlogData()

            .then(data => {
                if (data && Array.isArray(data.data)) {
                    const originalPosts = data.data;
                    const searchTerm = searchInput.value.toLowerCase();
                    const filteredPosts = originalPosts.filter(post => post.title.toLowerCase().includes(searchTerm));
                    renderPosts(filteredPosts);
                } 
                
                else {
                    console.error("Invalid data Format received from API");
                }
            })

            .catch(error => {
                console.error("Failed to fetch Posts", error);
            });
    };

    renderFilteredPosts();
});