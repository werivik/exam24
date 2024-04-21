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

        const titleHeader = createHeaderElement("Title");
        const secondTitleHeader = createHeaderElement("Second Title");
        const bodyHeader = createHeaderElement("Body");
        const mediaURLHeader = createHeaderElement("Media URL");
        const mediaAltHeader = createHeaderElement("Media Alt");
        const tagsHeader = createHeaderElement("Tags");

        editButton.addEventListener("click", () => {
            showElements([titleHeader, titleInput, secondTitleHeader, secondTitleInput, bodyHeader, bodyTextArea, mediaURLHeader, mediaURLInput, mediaAltHeader, mediaAltInput, tagsHeader, tagsInput, saveButton]);
            hideElements([editButton]);
        });

        saveButton.addEventListener("click", async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    throw new Error("No access Token found. Please try logging in again...");
                }

                const updatedData = {
                    title: titleInput.value,
                    secondTitle: secondTitleInput.value,
                    body: bodyTextArea.value,
                    media: {
                        url: mediaURLInput.value,
                        alt: mediaAltInput.value
                    },
                    tags: tagsInput.value.split(',').map(tag => tag.trim())
                };

                const options = {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(updatedData)
                };

                const response = await fetch(`https://v2.api.noroff.dev/blog/posts/wervik/${id}`, options);

                if (response.ok) {
                    alert("Blog Post Updated Successfully <3");
                    hideElements([saveButton]);
                    showElements([editButton]);
                } else {
                    const errorData = await response.json();
                    throw new Error(errorData.errors[0].message);
                }
            } catch (error) {
                console.error(error.message);
                alert("Failed to Update Blog Post, sorry not sorry...");
            }
        });

        appendElementsToContainer(blogDetailContainer, [titleHeader, titleInput, secondTitleHeader, secondTitleInput, bodyHeader, bodyTextArea, mediaURLHeader, mediaURLInput, mediaAltHeader, mediaAltInput, tagsHeader, tagsInput, editButton, saveButton]);
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
        textarea.value = value;
        textarea.classList.add("edit-textarea");
        return textarea;
    };

    const createButtonElement = (text) => {
        const button = document.createElement("button");
        button.textContent = text;
        button.classList.add("edit-post-button");
        return button;
    };

    const createHeaderElement = (text) => {
        const header = document.createElement("h3");
        header.textContent = text;
        return header;
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

    const appendElementsToContainer = (container, elements) => {
        elements.forEach(element => container.appendChild(element));
    };

    const showElements = (elements) => {
        elements.forEach(element => element.style.display = "block");
    };

    const hideElements = (elements) => {
        elements.forEach(element => element.style.display = "none");
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