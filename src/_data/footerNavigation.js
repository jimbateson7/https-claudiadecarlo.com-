const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

function loadYAML(filePath) {
  const fullPath = path.join(__dirname, filePath);
  const file = fs.readFileSync(fullPath, "utf8");
  return yaml.load(file);
}

function prefixUrl(url, lang) {
  if (!url) return url;
  if (url.startsWith('http') || url.startsWith('/en') || url.startsWith('/es')) return url;
  if (url.startsWith('/')) return `/${lang}${url}`;
  return `/${lang}/${url}`;
}

function processFooter(footer, lang) {
  return {
    ...footer,
    footerItems: footer.footerItems.map(item => ({
      ...item,
      finalUrl: prefixUrl(item.url, lang)
    }))
  };
}

const enFooter = loadYAML("./en/footerNavigation.yaml");
const esFooter = loadYAML("./es/footerNavigation.yaml");

module.exports = {
  en: processFooter(enFooter, 'en'),
  es: processFooter(esFooter, 'es')
};