import multer from "multer";
import { createError } from "../Utilities/Error.js";

// multer to handle files
export const upload = multer({
  dest: "uploads/",

  limits: {
    fileSize: 1024 * 1024,
  },
});

export const checkFileType = (req, res, next) => {
  
  // check if the file is an image
  const file = req.file;
  console.log(file);
  if (!file) {
    return next(createError(400, "Bad Request, no file uploaded"));
  }
  if (
    file.mimetype !== "image/jpeg" &&
    file.mimetype !== "image/webp" &&
    file.mimetype !== "image/png"
  ) {
    console.log("File Type not supported");
    return next(createError(400, "File type not supported"));
  }
  next();
};
