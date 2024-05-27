document.addEventListener("DOMContentLoaded", () => {

    const blogDetailContainer = document.querySelector(".admin-blog-detail");

    if (!blogDetailContainer) {
        console.error("Element with Class 'blog-detail' not found, I am a blind computer...");
        return;
    }

    const blogPostButtons = document.querySelector(".blog-post-buttons");

    const fetchBlogData = async (id) => {
        try {
            const response = await fetch(`https://v2.api.noroff.dev/blog/posts/wervik/${id}`);
            
            if (!response.ok) {
                throw new Error("Failed to Fetch Data from API, try again, loser");
            }

            const data = await response.json();
            
            return data;
        } 
        
        catch (error) {
            console.error("Error fetching Data:", error);
        }
    };

    const renderBlogPostDetail = (blogPost) => {
        console.log("Rendering Blog Post Detail:", blogPost);
        const { id, title, created, media, body, tags } = blogPost.data;
        const formattedDate = formatDate(created);

        const mediaContainer = createDivElement("media-container");
        const titleContainer = createDivElement("title-container");
        const bodyContainer = createDivElement("body-container");
        const tagsContainer = createDivElement("tags-container");

        const mediaURLInput = createInputElement("text", media.url || '');
        const mediaAltInput = createInputElement("text", media.alt || '');
        const titleInput = createInputElement("text", title);
        const bodyTextArea = createTextAreaElement(body);
        const tagsInput = createInputElement("text", tags.join(', '));

        const saveButtonContainer = createDivElement("save-button");
        const deleteButtonContainer = createDivElement("delete-button");

        const saveButton = createButtonElement("Save Changes", "save-button");
        const deleteButton = createButtonElement("Delete Post", "delete-button");

        const mediaURLHeader = createHeaderElement("Media URL");
        const mediaAltHeader = createHeaderElement("Media Alt");
        const titleHeader = createHeaderElement("Title");
        const bodyHeader = createHeaderElement("Body");
        const tagsHeader = createHeaderElement("Tags");

        const imagePreview = document.createElement("img");
        imagePreview.classList.add("image-preview");
        imagePreview.src = mediaURLInput.value;

        mediaURLInput.addEventListener("input", () => {
            imagePreview.src = mediaURLInput.value;
        });

        deleteButton.addEventListener("click", () => {
            const confirmDelete = confirm("Are you sure you want to delete this post?");
            
            if (confirmDelete) {
                const token = localStorage.getItem("token");
                deletePost(id, token);
            }
        });

        saveButton.addEventListener("click", async () => {
            
            try {
                const token = localStorage.getItem("token");
                const updatedData = {
                    media: {
                        url: mediaURLInput.value,
                        alt: mediaAltInput.value
                    },
                    
                    title: titleInput.value,
                    body: bodyTextArea.value.replace(/\n/g, '<br>'),
                    tags: tagsInput.value.split(',')
                };

                const response = await fetch(`https://v2.api.noroff.dev/blog/posts/wervik/${id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(updatedData)
                });

                if (!response.ok) {
                    throw new Error("Failed to update post");
                }

                alert("Post updated successfully");
                window.location.reload();
            } 
            
            catch (error) {
                console.error(error.message);
                alert("Failed to Update Blog Post, sorry not sorry...");
            }
        });

        appendElementsToContainer(mediaContainer, [imagePreview, mediaURLHeader, mediaURLInput, mediaAltHeader, mediaAltInput]);
        appendElementsToContainer(titleContainer, [titleHeader, titleInput]);
        appendElementsToContainer(bodyContainer, [bodyHeader, bodyTextArea]);
        appendElementsToContainer(tagsContainer, [tagsHeader, tagsInput]);

        appendElementsToContainer(saveButtonContainer, [saveButton]);
        appendElementsToContainer(deleteButtonContainer, [deleteButton]);

        appendElementsToContainer(blogDetailContainer, [mediaContainer, titleContainer, bodyContainer, tagsContainer]);
        appendElementsToContainer(blogPostButtons, [saveButtonContainer, deleteButtonContainer]);
    };

    const createInputElement = (type, value) => {
        const input = document.createElement("input");
        input.type = type;
        input.value = value;
        input.classList.add("edit-input");
        
        return input;
    };

    const createTextAreaElement = (value) => {
        const textarea = document.createElement("textarea");
        textarea.value = value.replace(/<br>/g, '\n');
        textarea.classList.add("edit-textarea");
       
        textarea.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                const start = textarea.selectionStart;
                const end = textarea.selectionEnd;
                textarea.value = textarea.value.substring(0, start) + '\n' + textarea.value.substring(end);
                textarea.selectionStart = textarea.selectionEnd = start + 1;
            }
        });

        return textarea;
    };

    const createButtonElement = (text, className) => {
        const button = document.createElement("button");
        button.textContent = text;
        button.classList.add("save-delete-button");
        button.classList.add(className);

        return button;
    };

    const createHeaderElement = (text) => {
        const header = document.createElement("h3");
        header.textContent = text;
        
        return header;
    };

    const createDivElement = (className) => {
        const div = document.createElement("div");
        div.classList.add(className);
       
        return div;
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

    const deletePost = async (postId, token) => {
        try {
            const response = await fetch(`https://v2.api.noroff.dev/blog/posts/wervik/${postId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
            });

            if (!response.ok) {
                throw new Error("Failed to delete post");
            }

            alert("Post deleted successfully");
            window.location.href = "admin-page.html";
        } 
        
        catch (error) {
            console.error(error.message);
            alert("Failed to Delete Blog Post, sorry not sorry...");
        }
    };

    const appendElementsToContainer = (container, elements) => {
        elements.forEach(element => container.appendChild(element));
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
    } 
    
    else {
        console.error("Blog post ID not provided in the URL");
    }

});