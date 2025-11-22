/* ----------------------------------------------------
   LOAD POSTS (DEFAULT + CUSTOM)
-----------------------------------------------------*/
let posts = JSON.parse(localStorage.getItem("blog_posts")) || initializeDefaultPosts();

// Save posts
function savePosts() {
    localStorage.setItem("blog_posts", JSON.stringify(posts));
}

/* ----------------------------------------------------
   DEFAULT POSTS (NO CATEGORY)
-----------------------------------------------------*/
function initializeDefaultPosts() {
    const defaults = [
        {
            id: 1,
            title: "How Machine Learning Is Transforming the World",
            image: "https://images.unsplash.com/photo-1508387025-4a14e8d56d36",
            body:
`Machine Learning (ML) is everywhere — powering recommendations, assisting doctors, and transforming industries.

Real-world applications:
• Healthcare  
• Self-driving cars  
• Speech recognition  
• Fraud detection  
• Personalized feeds

ML has become part of our daily life.`,
            date: "2025-01-12"
        },
        {
            id: 2,
            title: "A Beginner’s Guide to Web Development in 2025",
            image: "https://images.unsplash.com/photo-1526378722484-cc69d4f1c6b6",
            body:
`Web development evolves quickly.

Frontend:
HTML → CSS → JavaScript → React → Next.js

Backend:
Node.js → APIs → Databases → Cloud

Tools:
VS Code, GitHub, Vercel

Build small projects and grow.`,
            date: "2025-01-18"
        }
    ];

    localStorage.setItem("blog_posts", JSON.stringify(defaults));
    return defaults;
}

/* ----------------------------------------------------
   LOAD ALL POSTS FOR HOMEPAGE
-----------------------------------------------------*/
function loadHome() {
    const list = document.getElementById("post-list");
    if (!list) return;

    const latest = posts.slice().reverse();

    list.innerHTML = latest.map(
        p => `
    <div class="post" onclick="openPost(${p.id})">
        <h2>${p.title}</h2>
        <p>${p.body.substring(0, 130)}...</p>
        <small>${timeSince(p.date)} • ${readingTime(p.body)}</small>
    </div>`
    ).join("");
}

/* ----------------------------------------------------
   FEATURED POST = NEWEST POST
-----------------------------------------------------*/
function loadFeatured() {
    const box = document.getElementById("featured");
    if (!box) return;

    const p = posts[posts.length - 1];

    box.innerHTML = `
        <div class="featured-text">
            <div class="featured-meta">${timeSince(p.date)} • ${readingTime(p.body)}</div>
            <h1 class="featured-title">${p.title}</h1>
            <p class="featured-excerpt">${p.body.substring(0, 160)}...</p>
            <a class="read-link" onclick="openPost(${p.id})">Read more →</a>
        </div>

        <img src="${p.image}" class="featured-img">
    `;
}

/* ----------------------------------------------------
   OPEN SINGLE POST
-----------------------------------------------------*/
function openPost(id) {
    window.location = `post.html?id=${id}`;
}

/* ----------------------------------------------------
   LOAD POST PAGE
-----------------------------------------------------*/
let currentPostId = null;

function loadPost() {
    const params = new URLSearchParams(window.location.search);
    const id = Number(params.get("id"));
    currentPostId = id;

    const p = posts.find(post => post.id === id);
    if (!p) return;

    document.getElementById("post-title").innerText = p.title;
    document.getElementById("post-img").src = p.image;
    document.getElementById("post-body").innerText = p.body;
    document.getElementById("post-date").innerText = timeSince(p.date);
    document.getElementById("post-read").innerText = readingTime(p.body);
}

/* ----------------------------------------------------
   CREATE POST PAGE
-----------------------------------------------------*/
function createPost() {
    const title = document.getElementById("title").value.trim();
    const image = document.getElementById("image").value.trim();
    const body = document.getElementById("body").value.trim();

    if (!title || !body) {
        alert("Title and Body are required.");
        return;
    }

    const newPost = {
        id: Date.now(),
        title,
        image,
        body,
        date: new Date().toISOString().split('T')[0]
    };

    posts.push(newPost);
    savePosts();
    window.location = "index.html";
}

/* ----------------------------------------------------
   SEARCH POSTS
-----------------------------------------------------*/
function searchPosts() {
    const query = document.getElementById("search").value.toLowerCase();
    const list = document.getElementById("post-list");

    const filtered = posts.filter(
        p => p.title.toLowerCase().includes(query) ||
             p.body.toLowerCase().includes(query)
    );

    list.innerHTML = filtered.map(
        p => `
    <div class="post" onclick="openPost(${p.id})">
        <h2>${p.title}</h2>
        <p>${p.body.substring(0, 130)}...</p>
        <small>${timeSince(p.date)} • ${readingTime(p.body)}</small>
    </div>`
    ).join("");
}

/* ----------------------------------------------------
   READING TIME
-----------------------------------------------------*/
function readingTime(text) {
    const words = text.split(/\s+/).length;
    return Math.ceil(words / 200) + " min read";
}

/* ----------------------------------------------------
   TIME SINCE (“x days ago”)
-----------------------------------------------------*/
function timeSince(dateString) {
    const posted = new Date(dateString);
    const now = new Date();
    const days = Math.floor((now - posted) / (1000 * 60 * 60 * 24));

    if (days <= 0) return "Today";
    if (days === 1) return "1 day ago";
    return `${days} days ago`;
}

/* ----------------------------------------------------
   BOOKMARKS SYSTEM
-----------------------------------------------------*/
let bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];

function toggleBookmark() {
    if (bookmarks.includes(currentPostId)) {
        bookmarks = bookmarks.filter(id => id !== currentPostId);
    } else {
        bookmarks.push(currentPostId);
    }
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
    updateBookmarkState();
}

function updateBookmarkState() {
    const btn = document.getElementById("bookmarkBtn");
    if (!btn) return;

    if (bookmarks.includes(currentPostId)) {
        btn.classList.add("active");
    } else {
        btn.classList.remove("active");
    }
}

function loadBookmarks() {
    const box = document.getElementById("bookmarkList");
    if (!box) return;

    const saved = bookmarks.map(id => posts.find(p => p.id === id));

    box.innerHTML = saved.map(
        p => `
    <div class="post" onclick="openPost(${p.id})">
        <h2>${p.title}</h2>
        <p>${p.body.substring(0, 130)}...</p>
        <small>${timeSince(p.date)} • ${readingTime(p.body)}</small>
    </div>`
    ).join("") || "<p>No bookmarks yet.</p>";
}

/* ----------------------------------------------------
   AUTHOR PAGE
-----------------------------------------------------*/
function loadAuthorPosts() {
    const box = document.getElementById("authorPosts");
    if (!box) return;

    box.innerHTML = posts.map(
        p => `
        <div class="post" onclick="openPost(${p.id})">
            <h2>${p.title}</h2>
            <p>${p.body.substring(0,120)}...</p>
            <small>${timeSince(p.date)} • ${readingTime(p.body)}</small>
        </div>`
    ).join("");
}

/* ----------------------------------------------------
   SHARE POPUP
-----------------------------------------------------*/
function toggleShare() {
    const popup = document.getElementById("sharePopup");
    popup.style.display = popup.style.display === "none" ? "block" : "none";
}

function prepareShareButtons() {
    const url = window.location.href;

    document.getElementById("waShare").href = `https://wa.me/?text=${url}`;
    document.getElementById("twShare").href = `https://twitter.com/share?url=${url}`;
    document.getElementById("fbShare").href = `https://facebook.com/share.php?u=${url}`;
    document.getElementById("lnShare").href = `https://www.linkedin.com/shareArticle?url=${url}`;
}

function copyLink() {
    navigator.clipboard.writeText(window.location.href);
    alert("Link copied!");
}

/* ----------------------------------------------------
   COMMENTS SYSTEM
-----------------------------------------------------*/
function addComment() {
    const name = document.getElementById("commentName").value.trim();
    const text = document.getElementById("commentText").value.trim();

    if (!name || !text) {
        alert("Fill both fields.");
        return;
    }

    const comment = {
        name,
        text,
        time: new Date().toLocaleString()
    };

    const commentKey = `comments_${currentPostId}`;
    const existing = JSON.parse(localStorage.getItem(commentKey)) || [];
    existing.push(comment);

    localStorage.setItem(commentKey, JSON.stringify(existing));
    document.getElementById("commentName").value = "";
    document.getElementById("commentText").value = "";

    loadComments();
}

function loadComments() {
    const box = document.getElementById("commentsList");
    if (!box) return;

    const commentKey = `comments_${currentPostId}`;
    const comments = JSON.parse(localStorage.getItem(commentKey)) || [];

    box.innerHTML = comments.map(
        (c, i) => `
        <div class="comment-item">
            <strong>${c.name}</strong>
            <small>• ${c.time}</small>
            <p>${c.text}</p>
            <span class="delete-comment" onclick="deleteComment(${i})">✖</span>
        </div>`
    ).join("");
}

function deleteComment(index) {
    const commentKey = `comments_${currentPostId}`;
    let comments = JSON.parse(localStorage.getItem(commentKey)) || [];
    comments.splice(index, 1);
    localStorage.setItem(commentKey, JSON.stringify(comments));
    loadComments();
}
