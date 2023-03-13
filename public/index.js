const postsContainer = document.querySelector("#posts-container");
const userId = 5;
const postBtn = document.querySelector("#post-btn");
const logo = document.querySelector("#dormroom-logo");

const isElementLoaded = async (selector) => {
  while (document.querySelector(selector) === null) {
    await new Promise((resolve) => requestAnimationFrame(resolve));
  }
  return document.querySelectorAll(selector);
};

const isElementOneLoaded = async (selector) => {
  while (document.querySelector(selector) === null) {
    await new Promise((resolve) => requestAnimationFrame(resolve));
  }
  return document.querySelector(selector);
};

function toggleClass(event) {
  event.target.parentNode.nextElementSibling.classList.toggle("hidden");
}

function getComments() {
  axios.get("http://localhost:5500/comments/").then((res) => {
    res.data.forEach((c) => {
      let commentContainer = document
        .querySelector(`#post-${String(c.post_id)}`)
        .getElementsByClassName("comment-container")[0];
      let newExistingComment = `
      <div class="comment-existing">
        <figure class="comment-profile-icon"><img src="./images/profile-icon.png" alt="profile icon"></figure>
        <div class="comment"><b class="comment-author-name">${c.display_name}</b> <p class="comment-content">${c.comment}</p>
        </div>
      </div>
      `;
      commentContainer.innerHTML += newExistingComment;
    });
  });
}

function getProfile() {
  axios.get("http://localhost:5500/profile/").then((res) => {
    r = res.data[0];
    profileContainer = document.querySelector("#profile-container");
    profileContainer.innerHTML = "";
    let profile = `
    <div id="icon-and-name">
                    <figure class="profile-icon"><img src="./images/profile-icon.png" alt="profile icon"></figure>
                    <h3 id="profile-name">${r.display_name}</h3>
                </div>
                <div id="institution">
                    <p class="profile-subhead">Institution:</p>
                    <p>${r.institution}</p>
                </div>
                <div id="year-major">
                    <p class="profile-subhead">Year and Major:</p>
                    <p>Year ${r.year}, ${r.major}</p>
                </div>
    `;
    profileContainer.innerHTML += profile;
  });
}

function handleComment(event) {
  event.preventDefault();

  let postId = event.target.parentElement.parentElement.parentElement.id;
  postId = postId.replace("post-", "");
  let commentContent = document
    .querySelector(`#post-${postId}`)
    .querySelector(".comment-input").value;
  let body = {
    postId: postId,
    commentContent: commentContent,
  };

  axios.post("http://localhost:5500/comments/", body).then(() => {
    let allPosts = document.querySelectorAll(".post");
    allPosts.forEach((post) => {
      let oldExistingComments = post.querySelectorAll(".comment-existing");
      oldExistingComments.forEach((comment) => comment.remove());
    });
    getComments();
  });
}

function getPosts() {
  postsContainer.innerHTML = "";

  axios.get("http://localhost:5500/posts/").then((res) => {
    res.data.forEach((post) => {
      let postCard = `
        <section class="post" id="post-${post.post_id}">
                    <h1 class="post-title">${post.title}</h1>
                    <i class="fa-solid fa-pen-to-square"></i>
                    <i class="fa-solid fa-trash"></i>
                    <div class="post-author-info">
                        <figure class="post-profile-icon"><img src="./images/profile-icon.png" alt="profile icon"></figure>
                        <h3 class="post-author">${post.display_name}</h3>
                        <div class="post-uni">${post.institution}</div>
                    </div>
                    <section class="post-content">
                        <h3><b>Looking for: </b>${post.looking_for}</h3>
                        <h3><b>Location: </b>${post.location}</h3>
                        <h3><b>Vacancy: </b>${post.vacancy}</h3>
                        <h3><b>Qualifications: </b>${post.qualification}</h3>
                        <p>${post.description}</p>
                    </section>
                    <div class="btn-container">
                        <div class="comment-btn">Comment</div>
                        <div class="apply-btn">Apply</div>
                    </div>
                    <section class="comment-container hidden">
                        <div class="comment-new">
                            <figure class="comment-profile-icon"><img src="./images/profile-icon.png" alt="profile icon"></figure>
                            <input type="text" name="comment-input" class="comment-input" placeholder="comment here">
                            <div class="send-btn">Send</div>
                        </div>
                    </section>
                </section>
        `;
      if (parseInt(post.user_id) != userId) {
        postCard = postCard.replace(
          '<i class="fa-solid fa-pen-to-square"></i>',
          ""
        );
        postCard = postCard.replace('<i class="fa-solid fa-trash"></i>', "");
      }
      postsContainer.innerHTML += postCard;
    });
  });
  isElementLoaded(".fa-trash").then((deleteBtns) => {
    deleteBtns.forEach((item) => {
      item.addEventListener("click", deletePost);
    });
  });
  isElementLoaded(".fa-pen-to-square").then((editBtns) => {
    editBtns.forEach((item) => {
      item.addEventListener("click", editAPost);
    });
  });
  isElementLoaded(".send-btn").then((sendBtns) => {
    sendBtns.forEach((item) => {
      item.addEventListener("click", handleComment);
    });
  });
  isElementLoaded(".comment-btn").then((commentBtns) => {
    commentBtns.forEach((item) => {
      item.addEventListener("click", toggleClass);
    });
  });
}

function displayEntry() {
  postsContainer.innerHTML = "";
  let entryPage = `
  <section class="post-entry">
    <label for="title">Title: </label>
    <input type="text" name="title" id="title" class="info-input" placeholder="Grab people's attention with an awesome title!">
    <label for="looking-for">Looking for: </label>
    <input type="text" name="looking-for" id="looking-for" class="info-input" placeholder="Who are you looking for?">
    <label for="location">Location: </label>
    <input type="text" name="location" id="location" class="info-input" placeholder="Where do you wanna work with your colleagues?">
    <label for="vacancy">Vacancy: </label>
    <input type="text" name="vacancy" id="vacancy" class="info-input" placeholder="How many people are you looking for?">
    <label for="qualification">Qualification: </label>
    <input type="text" name="qualification" id="qualification" class="info-input" placeholder="What skills should your colleagues have?">
    <label for="description">Description: </label>
    <textarea name="description" id="description" class="info-input" wrap="hard" placeholder="Elaborate more on your idea"></textarea>
    <div class="create-post-btn">Get it out there!</div>
  </section>
  `;
  postsContainer.innerHTML += entryPage;
  const createPostBtn = document.querySelector(".create-post-btn");
  createPostBtn.addEventListener("click", createPost);
}

function createPost() {
  let body = {
    title: document.querySelector("#title").value,
    looking_for: document.querySelector("#looking-for").value,
    location: document.querySelector("#location").value,
    vacancy: document.querySelector("#vacancy").value,
    qualification: document.querySelector("#qualification").value,
    description: document.querySelector("#description").value,
  };

  axios.post("http://localhost:5500/posts", body).then(() => {
    getPosts();
    getComments();
  });
}

function postAProject(event) {
  event.preventDefault();
  displayEntry();
  createPost();
}

function deletePost(event) {
  event.preventDefault();
  let id = event.target.parentElement.id;
  id = parseInt(id.replace("post-", ""));
  axios.delete(`http://localhost:5500/posts/${id}`).then(() => {
    getPosts();
    getComments();
  });
}

function displayEdit(postId) {
  postsContainer.innerHTML = "";
  let editPage = `
  <section class="post-entry" id="post-${postId}">
    <label for="title">Title: </label>
    <input type="text" name="title" id="title" class="info-input" placeholder="Grab people's attention with an awesome title!">
    <label for="looking-for">Looking for: </label>
    <input type="text" name="looking-for" id="looking-for" class="info-input" placeholder="Who are you looking for?">
    <label for="location">Location: </label>
    <input type="text" name="location" id="location" class="info-input" placeholder="Where do you wanna work with your colleagues?">
    <label for="vacancy">Vacancy: </label>
    <input type="text" name="vacancy" id="vacancy" class="info-input" placeholder="How many people are you looking for?">
    <label for="qualification">Qualification: </label>
    <input type="text" name="qualification" id="qualification" class="info-input" placeholder="What skills should your colleagues have?">
    <label for="description">Description: </label>
    <textarea name="description" id="description" class="info-input" wrap="hard" placeholder="Elaborate more on your idea"></textarea>
    <div class="update-post-btn">Save changes</div>
  </section>
  `;
  postsContainer.innerHTML += editPage;
}

function editReq(postId) {
  axios
    .get(`http://localhost:5500/posts/${postId}`)
    .then((res) => {
      post = res.data[0];
      document.getElementById("title").value = post.title;
      document.querySelector("#looking-for").value = post.looking_for;
      document.querySelector("#location").value = post.location;
      document.querySelector("#vacancy").value = post.vacancy;
      document.querySelector("#qualification").value = post.qualification;
      document.querySelector("#description").value = post.description;
      isElementOneLoaded(".update-post-btn").then((updatePostBtn) => {
        updatePostBtn.addEventListener("click", updatePost);
      });
    })
    .catch((err) => console.log(err));
}

function editAPost(event) {
  event.preventDefault();
  let postId = event.target.parentElement.id;
  postId = parseInt(postId.replace("post-", ""));
  displayEdit(postId);
  editReq(postId);
}

function updatePost(event) {
  event.preventDefault();
  let postId = event.target.parentElement.id;
  postId = parseInt(postId.replace("post-", ""));
  let body = {
    postId: postId,
    title: document.querySelector("#title").value,
    looking_for: document.querySelector("#looking-for").value,
    location: document.querySelector("#location").value,
    vacancy: document.querySelector("#vacancy").value,
    qualification: document.querySelector("#qualification").value,
    description: document.querySelector("#description").value,
  };
  axios.put("http://localhost:5500/posts", body).then(() => {
    getPosts();
    getComments();
  });
}

function reload(event) {
  event.preventDefault();
  getPosts();
  getComments();
}

getProfile();
getPosts();
getComments();

postBtn.addEventListener("click", displayEntry);
logo.addEventListener("click", reload);
