async function getUserUsingTry() {
  try {
    p = await new Promise((resolve, reject) => {
      reject("Boom");
    });
  } catch (err) {
    console.log("Error is handled: " + err);
  }
}

getUserUsingTry();

async function getUserUsingCatch() {
  p = await new Promise((resolve, reject) => {
    reject("Boom");
  }).catch((err) => console.log("Error is handled: " + err));
}

getUserUsingTry();
getUserUsingCatch();
