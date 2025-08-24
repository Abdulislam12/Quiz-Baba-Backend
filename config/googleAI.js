const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

const getModel = () => genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

module.exports = getModel;
