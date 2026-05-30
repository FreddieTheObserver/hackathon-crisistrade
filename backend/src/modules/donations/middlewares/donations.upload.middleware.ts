import multer from "multer";
import path from "node:path";
import fs from "node:fs";


const uploadDir = path.join(process.cwd(), "uploads", "donations");

fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, uploadDir);
  },
  filename: (_req, file, callback) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "-");
    callback(null, `${Date.now()}-${safeName}`);
  },
});

export const donationPhotoUpload = multer({
  storage,
  fileFilter: (_req, file, callback) => {
    if (!file.mimetype.startsWith("image/")) {
      callback(new Error("Only image uploads are allowed"));
      return;
    }

    callback(null, true);
  },
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
}).single("photo");