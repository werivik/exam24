document.addEventListener("DOMContentLoaded", () => {
    const blogDetailContainer = document.querySelector(".admin-blog-detail");

    if (!blogDetailContainer) {
        console.error("Element with Class 'blog-detail' not found, I am a blind computer...");
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

        const titleInput = createInputElement("text", title);
        const secondTitleInput = createInputElement("text", secondTitle);
        const bodyTextArea = createTextAreaElement(body);
        const mediaURLInput = createInputElement("text", media.url || '');
        const mediaAltInput = createInputElement("text", media.alt || '');
        const tagsInput = createInputElement("text", tags.join(', '));

        const saveButton = createButtonElement("Save Changes");
        const editButton = createButtonElement("Edit Post");
        const deleteButton = createButtonElement("Delete Post");

        const titleHeader = createHeaderElement("Title");
        const secondTitleHeader = createHeaderElement("Second Title");
        const bodyHeader = createHeaderElement("Body");
        const mediaURLHeader = createHeaderElement("Media URL");
        const mediaAltHeader = createHeaderElement("Media Alt");
        const tagsHeader = createHeaderElement("Tags");

        const imagePreview = document.createElement("img");
        imagePreview.classList.add("image-preview");

        mediaURLInput.addEventListener("input", () => {
            imagePreview.src = mediaURLInput.value;
        });

        deleteButton.addEventListener("click", () => {
            const confirmDelete = confirm("Are you sure you want to delete this post?");
            if (confirmDelete) {
                deletePost(id);
            }
        });

        editButton.addEventListener("click", () => {
            showElements([titleHeader, titleInput, secondTitleHeader, secondTitleInput, bodyHeader, bodyTextArea, mediaURLHeader, mediaURLInput, imagePreview, mediaAltHeader, mediaAltInput, tagsHeader, tagsInput, saveButton, deleteButton]);
            hideElements([editButton]);
        });

        saveButton.addEventListener("click", async () => {
            try {
                // Your save button logic here
            } catch (error) {
                console.error(error.message);
                alert("Failed to Update Blog Post, sorry not sorry...");
            }
        });

        appendElementsToContainer(blogDetailContainer, [titleHeader, titleInput, secondTitleHeader, secondTitleInput, bodyHeader, bodyTextArea, mediaURLHeader, mediaURLInput, imagePreview, mediaAltHeader, mediaAltInput, tagsHeader, tagsInput, editButton, saveButton, deleteButton]);
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

    const deletePost = async (postId) => {
        try {
            
        } catch (error) {
            console.error(error.message);
            alert("Failed to Delete Blog Post, sorry not sorry...");
        }
    };

    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');

    if (postId) {
        fetchBlogData(postId)
            .then((data) => {
                renderBlogPostDetail(data);
            })
            .catch((error) => {
                console.error("Failed to fetch blog post:", error);
            });
    } else {
        console.error("Blog post ID not provided in the URL");
    }
});