import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "expense_receipts",
    allowed_formats: ["jpg", "png", "jpeg", "pdf"],
    transformation: [{ width: 1000, height: 1000, crop: "limit" }],
    public_id: (req, file) => `receipt_${Date.now()}`, // Genera un nome univoco per ogni file
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/") || file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Tipo di file non supportato. Carica solo immagini o PDF."), false);
  }
};

const cloudinaryUploader = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // Limite di 5MB
  },
});

export default cloudinaryUploader;