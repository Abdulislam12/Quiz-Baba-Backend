const multer = require("multer");

// Use memory storage instead of disk storage
const storage = multer.memoryStorage();

// File filter
const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif/;
  const mimeType = allowed.test(file.mimetype);
  const extname = allowed.test(file.originalname.toLowerCase());

  if (mimeType && extname) cb(null, true);
  else cb(new Error("Only image files are allowed"));
};

// Multer instance
const upload = multer({ storage, fileFilter });

module.exports = upload;
