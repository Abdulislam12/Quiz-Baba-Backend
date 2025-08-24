const fs = require("fs");
const path = require("path");
const getModel = require("../config/googleAI");

exports.handleUpload = async (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .json({ error: "Invalid file type. Only images are allowed." });
  }

  const filePath = path.join(__dirname, "..", "uploads", req.file.filename);

  console.log("File:", req.file);

  setTimeout(() => {
    fs.unlink(filePath, (err) => {
      if (err) console.error("Failed to delete file:", err);
      else console.log(`File ${req.file.filename} deleted`);
    });
  }, process.env.FILE_DELETE_TIMEOUT || 60000);

  try {
    const model = getModel();
    const result = await model.generateContent([
      "Tell me only the correct option from the following. Do not include extra explanation.",
      {
        inlineData: {
          data: Buffer.from(fs.readFileSync(filePath)).toString("base64"),
          mimeType: req.file.mimetype,
        },
      },
    ]);

    const responseText = await result.response.text();

    res.json({
      message: "Image uploaded and processed successfully",
      file: req.file,
      aiResponse: responseText,
    });
  } catch (error) {
    res.status(500).json({
      error: "Error processing the image with Google Generative AI",
      details: error.message,
    });
  }
};
