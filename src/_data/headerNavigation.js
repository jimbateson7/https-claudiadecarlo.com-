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

function processNav(nav, lang) {
  return {
    ...nav,
    headerItems: nav.headerItems.map(item => ({
      ...item,
      finalUrl: prefixUrl(item.url, lang)
    }))
  };
}

const enNav = loadYAML("./en/headerNavigation.yaml");
const esNav = loadYAML("./es/headerNavigation.yaml");

module.exports = {
  en: processNav(enNav, 'en'),
  es: processNav(esNav, 'es')
};