function getA() {
  return new Promise((resolve) => resolve("A"));
}

function getB() {
  return new Promise((resolve, reject) => reject(new Error("B failed")));
}

function getC() {
  return new Promise((resolve) => resolve("C"));
}

async function compareAll() {
  console.log("=== Testing Promise.all vs Promise.allSettled ===\n");

  // Test Promise.all (fails fast)
  console.log("1. Testing Promise.all:");
  try {
    const allResults = await Promise.all([getA(), getB(), getC()]);
    console.log("Promise.all results:", allResults);
  } catch (error) {
    console.log("Promise.all failed fast:", error.message);
  }

  console.log("\n2. Testing Promise.allSettled:");
  // Test Promise.allSettled (collects all outcomes)
  const allSettledResults = await Promise.allSettled([getA(), getB(), getC()]);
  console.log("Promise.allSettled results:");
  allSettledResults.forEach((result, index) => {
    const funcName = ["getA", "getB", "getC"][index];
    if (result.status === "fulfilled") {
      console.log(`  ${funcName}(): fulfilled with "${result.value}"`);
    } else {
      console.log(`  ${funcName}(): rejected with "${result.reason.message}"`);
    }
  });

  // Extract values (fulfilled) and nulls (rejected) for comparison
  const values = allSettledResults.map((r) =>
    r.status === "fulfilled" ? r.value : null
  );
  console.log("Extracted values:", values);

  console.log("\n=== Key Differences ===");
  console.log(
    "- Promise.all: Fails fast on first rejection, doesn't wait for others"
  );
  console.log(
    "- Promise.allSettled: Waits for all promises, returns {status, value|reason} for each"
  );
}

// Run the comparison
compareAll();
