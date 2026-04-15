import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js"; // Import your config above

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "events",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

const fileFilter = (req, file, cb) => {
  try {
    const allowedMimes = ["image/jpeg", "image/png"];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Unsupported file format. Only JPG, PNG, and JPEG are allowed.",
        ),
        false,
      );
    }
  } catch (error) {
    cb(error, false);
  }
};

export const upload = multer({ storage: storage, fileFilter: fileFilter });
