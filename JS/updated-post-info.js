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

updateInfo ()