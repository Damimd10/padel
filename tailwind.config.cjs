const path = require("node:path");
const sharedPreset = require("./packages/config/tailwind-preset.cjs");

module.exports = {
  content: [
    path.join(__dirname, "apps/**/*.{ts,tsx}"),
    path.join(__dirname, "packages/**/*.{ts,tsx}"),
  ],
  presets: [sharedPreset],
};
