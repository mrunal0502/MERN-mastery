p = new Promise((resolve) => resolve("Data"))
  .then((res) => res.toUpperCase())
  .then((d) => console.log(d));
