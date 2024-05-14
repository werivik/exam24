document.addEventListener("DOMContentLoaded", async () => {
    const newlyPostedContainer = document.querySelector(".newly-posted");

    if (!newlyPostedContainer) {
        console.error("Element with class 'newly-posted' not found.");
       
        return;
    }

    let posts;
    let totalPosts;
    let slideshowInterval;
    let currentIndex = 0;

    const fetchBlogData = async () => {
        try {
            const response = await fetch("https://v2.api.noroff.dev/blog/posts/wervik");
            if (!response.ok) {
                throw new Error("Failed to Fetch Data from API");
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

    const updateDotOpacity = (startIndex, endIndex) => {
        const dotElements = document.querySelectorAll('.dot-newly');

        dotElements.forEach((dot, index) => {
            if (index >= startIndex && index <= endIndex) {
                dot.style.opacity = 1;
            } 
            
            else {
                dot.style.opacity = 0.5;
            }
        });
    };

    const showPost = (index) => {
        const startIndex = index;
        const endIndex = index + 2;

        const postElements = document.querySelectorAll('.new-post');

        postElements.forEach((post, i) => {
            if (i >= startIndex && i <= endIndex) {
                post.style.display = 'block';
            } 
            
            else {
                post.style.display = 'none';
            }
        });

        updateDotOpacity(startIndex, endIndex);
    };

    const nextSlide = () => {
        currentIndex = (currentIndex + 1) % totalPosts;
        showPost(currentIndex);
    };

    const prevSlide = () => {
        currentIndex = (currentIndex - 1 + totalPosts) % totalPosts;
        showPost(currentIndex);
    };
    
    const data = await fetchBlogData();

    if (data && data.data && Array.isArray(data.data)) {
        posts = data.data.slice(0, 9);

        posts.forEach((post) => {
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
        });

        const nextLeftButton = document.querySelector('.next-left-newly');
        const nextRightButton = document.querySelector('.next-right-newly');

        nextLeftButton.addEventListener('click', () => {
            prevSlide();
        });

        nextRightButton.addEventListener('click', () => {
            nextSlide();
        });
    } 
    
    else {
        console.error("Invalid data format received from API");
    }
});