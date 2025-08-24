const multer = require("multer");
const path = require("path");

// Storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif/;
  const mimeType = allowed.test(file.mimetype);
  const extname = allowed.test(path.extname(file.originalname).toLowerCase());

  if (mimeType && extname) cb(null, true);
  else cb(new Error("Only image files are allowed"));
};

// Multer instance
const upload = multer({ storage, fileFilter });

module.exports = upload;
