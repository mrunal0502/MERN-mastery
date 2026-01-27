import fs from "fs";
import path from "path";
import { uploadOnCloudinary } from "./utils/cloudinary.js";

const filePath = path.join(process.cwd(), "public", "temp", "a.png");
console.log("Test file path:", filePath);
console.log("Exists before test:", fs.existsSync(filePath));

(async () => {
  const res = await uploadOnCloudinary(filePath);
  console.log("Upload result:", res);
})();
