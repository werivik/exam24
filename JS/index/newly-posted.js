document.addEventListener("DOMContentLoaded", async () => {
    const newlyPostedContainer = document.querySelector(".newly-posted");

    if (!newlyPostedContainer) {
        console.error("Element with class 'newly-posted' not found.");
        
        return;
    }

    let posts;
    let totalPosts;
    let currentIndex = 0;

    const fetchBlogData = async () => {
        try {
            const response = await fetch("https://v2.api.noroff.dev/blog/posts/wervik");
            if (!response.ok) {
                throw new Error("Failed to fetch data from API");
            }

            const data = await response.json();
            posts = data.data.slice(0, 9);
            totalPosts = posts.length;
            
            return data;
        } 
        
        catch (error) {
            console.error("Error fetching data:", error);
           
            return null;
        }
    };

    const getPostsToShow = () => {
        return window.innerWidth <= 800 ? 2 : 3;
    };

    const showPosts = () => {
        const postsToShow = getPostsToShow();
        newlyPostedContainer.innerHTML = '';

        for (let i = currentIndex; i < currentIndex + postsToShow; i++) {
            const post = posts[i % totalPosts];
            const postElement = document.createElement("div");
            postElement.classList.add("new-post");
            postElement.innerHTML = `
                <a href="blog-post-detail.html?id=${post.id}" class="blog-link">
                    <img src="${post.media.url}" alt="${post.media.alt}">
                    <div class="post-textbox">
                        <h2 class="title">${post.title}</h2>
                    </div>
                </a>
            `;
            newlyPostedContainer.appendChild(postElement);
        }
    };

    const nextSlide = () => {
        const postsToShow = getPostsToShow();
        currentIndex = (currentIndex + postsToShow) % totalPosts;
        showPosts();
    };

    const prevSlide = () => {
        const postsToShow = getPostsToShow();
        currentIndex = (currentIndex - postsToShow + totalPosts) % totalPosts;
        showPosts();
    };

    const handleResize = () => {
        showPosts();
    };

    window.addEventListener('resize', handleResize);

    const data = await fetchBlogData();

    if (data && data.data && Array.isArray(data.data)) {
        posts = data.data.slice(0, 9);
        showPosts();

        const nextLeftButton = document.querySelector('.next-left-newly');
        const nextRightButton = document.querySelector('.next-right-newly');

        nextLeftButton.addEventListener('click', prevSlide);
        nextRightButton.addEventListener('click', nextSlide);
    } 
    
    else {
        console.error("Invalid data format received from API");
    }
});