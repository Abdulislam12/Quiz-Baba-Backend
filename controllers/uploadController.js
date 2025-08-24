const fs = require("fs");
const path = require("path");
const getModel = require("../config/googleAI");

exports.handleUpload = async (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .json({ error: "Invalid file type. Only images are allowed." });
  }

  try {
    const model = getModel();

    const result = await model.generateContent([
      "Tell me only the correct option from the following. Do not include extra explanation.",
      {
        inlineData: {
          data: req.file.buffer.toString("base64"), // directly from memory
          mimeType: req.file.mimetype,
        },
      },
    ]);

    const responseText = await result.response.text();

    res.json({
      message: "Image uploaded and processed successfully",
      file: {
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
      },
      aiResponse: responseText,
    });
  } catch (error) {
    res.status(500).json({
      error: "Error processing the image with Google Generative AI",
      details: error.message,
    });
  }
};
