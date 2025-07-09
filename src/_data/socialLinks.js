const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

function loadYAML(filePath) {
  const fullPath = path.join(__dirname, filePath);
  const file = fs.readFileSync(fullPath, "utf8");
  return yaml.load(file);
}

module.exports = {
  en: loadYAML("./en/socialLinks.yaml"),
  es: loadYAML("./es/socialLinks.yaml"),
};