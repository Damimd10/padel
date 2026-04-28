const sharedPreset = require("../config/tailwind-preset.cjs");

module.exports = {
  content: ["./src/**/*.{ts,tsx}", "./.storybook/**/*.{ts,tsx}"],
  presets: [sharedPreset],
};
