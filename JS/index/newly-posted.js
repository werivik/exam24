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

            posts = data.data.slice(0, 10);
            totalPosts = posts.length;

            return data;
        } 
        
        catch (error) {
            console.error("Error fetching data:", error);
            return null;
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
        const endIndex = (index + 2) % totalPosts;
    
        const postElements = document.querySelectorAll('.new-post');
    
        postElements.forEach((post) => {
            post.style.display = 'none';
        });
    
        if (startIndex <= endIndex) {
            
            for (let i = startIndex; i <= endIndex; i++) {
                postElements[i].style.display = 'block';
            }

        } 
        else {

            for (let i = startIndex; i < totalPosts; i++) {
                postElements[i].style.display = 'block';
            }
            
            for (let i = 0; i <= endIndex; i++) {
                postElements[i].style.display = 'block';
            }
        }
    
        updateDotOpacity(startIndex, endIndex);
    };

    const startSlideshow = () => {
        slideshowInterval = setInterval(nextSlide, 5000);
    };

    const stopSlideshow = () => {
        clearInterval(slideshowInterval);
    };

const nextSlide = () => {
    currentIndex = (currentIndex + 1) % totalPosts;
    
    if (currentIndex === 0) {
        showPost(totalPosts - 2);
    } 
    
    else if (currentIndex === 1) {
        showPost(totalPosts - 1);
    } 
    
    else {
        showPost(currentIndex - 2);
    }
};

const prevSlide = () => {
    currentIndex = (currentIndex - 1 + totalPosts) % totalPosts;
    
    if (currentIndex === totalPosts - 1) {
        showPost(1);
    } 
    
    else if (currentIndex === totalPosts - 2) {
        showPost(0); 
    } 
    
    else {
        showPost(currentIndex);
    }
};

    const pauseSlideshow = () => {
        stopSlideshow();
    };

    const data = await fetchBlogData();

    if (data && data.data && Array.isArray(data.data)) {
        posts = data.data.slice(0, 10);

        posts.forEach((post) => {
            const postElement = document.createElement("div");
            postElement.classList.add("new-post");
            postElement.innerHTML = `
                <a href="blog-post-detail.html?id=${post.id}" class="blog-link">
                    <img src="${post.media.url}" alt="${post.media.alt}">
                    <div class="post-textbox">
                        <h2 class="title">${post.title}</h2>
                        <p class="published">Published: ${formatDate(post.created)}</p>
                    </div>
                </a>
            `;

            postElement.addEventListener('mouseenter', pauseSlideshow);
            postElement.addEventListener('mouseleave', startSlideshow);

            newlyPostedContainer.appendChild(postElement);
        });

        startSlideshow();

        const nextLeftButton = document.querySelector('.next-left-newly');
        const nextRightButton = document.querySelector('.next-right-newly');

        nextLeftButton.addEventListener('click', () => {
            pauseSlideshow();
            prevSlide();
        });

        nextRightButton.addEventListener('click', () => {
            pauseSlideshow();
            nextSlide();
        });
    } 
    
    else {
        console.error("Invalid data format received from API");
    }
});