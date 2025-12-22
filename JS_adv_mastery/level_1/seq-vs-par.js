// Generate random delay between 100-500ms
function getRandomDelay() {
  return Math.floor(Math.random() * 401) + 100; // 100-500ms
}

function f1() {
  const delay = getRandomDelay();
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
      console.log(`f1 completed (${delay}ms)`);
    }, delay);
  });
}

function f2() {
  const delay = getRandomDelay();
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
      console.log(`f2 completed (${delay}ms)`);
    }, delay);
  });
}

function f3() {
  const delay = getRandomDelay();
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
      console.log(`f3 completed (${delay}ms)`);
    }, delay);
  });
}

//sequential execution
async function seq() {
  console.log("Starting sequential execution...");
  const startTime = Date.now();

  await f1();
  await f2();
  await f3();

  const endTime = Date.now();
  const totalTime = endTime - startTime;
  console.log(`Sequential execution completed in ${totalTime}ms\n`);
  return totalTime;
}

//parallel execution
async function par() {
  console.log("Starting parallel execution...");
  const startTime = Date.now();

  await Promise.all([f1(), f2(), f3()]);

  const endTime = Date.now();
  const totalTime = endTime - startTime;
  console.log(`Parallel execution completed in ${totalTime}ms\n`);
  return totalTime;
}

// Run both and compare
async function runComparison() {
  console.log("=== Sequential vs Parallel Execution Comparison ===\n");

  const seqTime = await seq();

  // Wait a bit between executions for clarity
  await new Promise((resolve) => setTimeout(resolve, 100));

  const parTime = await par();

  console.log("=== Results ===");
  console.log(`Sequential time: ${seqTime}ms`);
  console.log(`Parallel time: ${parTime}ms`);
  console.log(
    `Time saved: ${seqTime - parTime}ms (${Math.round(
      ((seqTime - parTime) / seqTime) * 100
    )}%)`
  );
  console.log(`\nExpected: Parallel ≈ max(delays), Sequential ≈ sum(delays)`);
}

runComparison();
