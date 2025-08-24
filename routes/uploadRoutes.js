const express = require("express");
const upload = require("../middleware/upload");
const { handleUpload } = require("../controllers/uploadController.js");

const router = express.Router();

router.post("/upload", upload.single("image"), handleUpload);

module.exports = router;
