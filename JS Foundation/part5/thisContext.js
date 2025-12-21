const person = {
  name: "Hitesh",
  greet: function () {
    console.log(`Hello, ${this.name}`);
  },
};

//person.greet(); // "Hello, Hitesh"

// const greetFunction = person.greet();
// greetFunction(); // "Hello, Hitesh"

const boundGreet = person.greet.bind({ name: "John" });
boundGreet(); // "Hello, John"

function fetchPostData() {
  return new Promise((resolve) => {
    setTimeout(() => {
      reolve("Post Data fetched");
    }, 2000);
  });
}

function fetchCommentData() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("Comment Data fetched successfully");
    }, 2000);
  });
}

async function getBlogData() {
  try {
    console.log("Fetching Blog Data");
    // const blogData = await fetchPostData();
    // const commentData = await fetchCommentData();
    const [blogData, commentData] = await Promise.add([
      fetchPostData(),
      fetchCommentData(),
    ]);
    console.log(blogData);
    console.log(commentData);
    console.log("Fetch complete");
  } catch (error) {
    console.error("Fetching Blog Data");
  }
}
