const getModel = require("../config/googleAI");

exports.handleUpload = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      error: "Invalid file type. Only images are allowed.",
    });
  }

  // Always get model & id once
  const { model, id, setCooldown } = getModel();

  try {
    const result = await model.generateContent([
      "Tell me only the correct option from the following. Do not include extra explanation.",
      {
        inlineData: {
          data: req.file.buffer.toString("base64"),
          mimeType: req.file.mimetype,
        },
      },
    ]);

    const responseText = await result.response.text();

    console.log(`✅ ${id} handled the request successfully`);

    return res.json({
      message: "Image processed successfully",
      aiResponse: responseText,
    });
  } catch (error) {
    console.error(`🔥 ${id} failed with error:`, error.message);

    // If this specific key hit rate limit → cooldown it
    if (error.message.includes("429") || error.status === 429) {
      setCooldown(id);
      return res.status(429).json({
        error: `${id} hit rate limit. Cooling down for 5 minutes.`,
      });
    }

    return res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
};
