import path from "node:path";
import { randomUUID } from "node:crypto";
import multer from "multer";

// Resolved against the backend cwd (npm run dev runs tsx from backend/),
// which matches the directory served statically at /uploads in index.ts.
const uploadsDir = path.resolve(process.cwd(), "uploads");

const storage = multer.diskStorage({
      destination: (_req, _file, cb) => cb(null, uploadsDir),
      filename: (_req, file, cb) => {
            const ext = path.extname(file.originalname);
            cb(null, `${randomUUID()}${ext}`);
      },
});

// Optional single image, ~2 MB cap, image MIME only.
export const uploadTradePhoto = multer({
      storage,
      limits: { fileSize: 2 * 1024 * 1024 },
      fileFilter: (_req, file, cb) => {
            if (file.mimetype.startsWith("image/")) {
                  cb(null, true);
            } else {
                  cb(Object.assign(new Error("Only image uploads are allowed"), { status: 400 }));
            }
      },
}).single("photo");
