import multer from "multer";

// Use memory storage instead of disk to avoid file access issues
const storage = multer.memoryStorage();

export const upload = multer({ storage });
