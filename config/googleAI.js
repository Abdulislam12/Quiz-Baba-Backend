const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

let keys = [];
let currentIndex = 0;
let lastReload = 0;
const RELOAD_INTERVAL = 30 * 1000; // reload .env every 30s
const COOLDOWN_DURATION = 5 * 60 * 1000; // 5 minutes

// cooldown tracker
let cooldowns = {}; // { API1: timestamp }

function loadKeys() {
  const envKeys = Object.keys(process.env)
    .filter((k) => k.startsWith("GOOGLE_API_KEY_"))
    .map((k, i) => ({
      id: `API${i + 1}`,
      key: process.env[k],
    }));

  if (envKeys.length === 0) {
    throw new Error("❌ No Google API keys found in .env");
  }

  if (envKeys.length !== keys.length) {
    console.log(
      `♻️ Detected ${envKeys.length} Gemini keys (previously ${keys.length}) — reloaded.`
    );
    keys = envKeys;
  }

  return keys;
}

function isCoolingDown(id) {
  const now = Date.now();
  return cooldowns[id] && now < cooldowns[id];
}

function setCooldown(id) {
  cooldowns[id] = Date.now() + COOLDOWN_DURATION;
  const mins = COOLDOWN_DURATION / 60000;
  console.log(
    `🕒 ${id} is cooling down for ${mins} minute(s) due to 429 error`
  );
}

function getNextKey() {
  const now = Date.now();
  if (now - lastReload > RELOAD_INTERVAL) {
    lastReload = now;
    loadKeys();
  }

  if (!keys.length) loadKeys();

  let attempts = 0;
  while (attempts < keys.length) {
    const selected = keys[currentIndex];
    currentIndex = (currentIndex + 1) % keys.length;

    if (!isCoolingDown(selected.id)) {
      console.log(`🚀 Using ${selected.id} for this request`);
      return selected;
    }

    attempts++;
  }

  throw new Error("⏳ All API keys are cooling down. Try again later.");
}

function getModel() {
  const { key, id } = getNextKey();
  const genAI = new GoogleGenerativeAI(key);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  return { model, id, setCooldown };
}

module.exports = getModel;
