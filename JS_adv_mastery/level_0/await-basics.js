async function getUser() {
  console.log("start");
  p = await new Promise((resolve) => {
    console.log("Before await");
    resolve("Resolved");
    console.log("After await");
  });
  console.log("end");
}

getUser();
