const { eleventyImageTransformPlugin } = require("@11ty/eleventy-img");
const yaml = require("js-yaml");
const { DateTime } = require("luxon");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const markdownIt = require("markdown-it");

module.exports = function(eleventyConfig) {
  eleventyConfig.addPlugin(eleventyImageTransformPlugin);
  eleventyConfig.addPlugin(syntaxHighlight);

  const md = new markdownIt({
    html: true,
    breaks: true,
  });

  eleventyConfig.addFilter("markdown", (content) => {
    return md.render(content);
  });

  eleventyConfig.setUseGitIgnore(false);
  eleventyConfig.setDataDeepMerge(true);

  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("dd LLL yyyy");
  });

  eleventyConfig.addGlobalData("currentYear", () => {
    return DateTime.now().toFormat("yyyy");
  });

  eleventyConfig.addDataExtension("yaml", (contents) => yaml.load(contents));

  eleventyConfig.addPassthroughCopy({
    "./src/admin/config.yml": "./admin/config.yml",
    "./node_modules/alpinejs/dist/cdn.min.js": "./static/js/alpine.js",
    "./node_modules/prismjs/themes/prism-tomorrow.css": "./static/css/prism-tomorrow.css",
  });

  eleventyConfig.addPassthroughCopy("./src/static/img");
  eleventyConfig.addPassthroughCopy("./src/static/favicons");
  eleventyConfig.addPassthroughCopy("./src/static/fonts");
  eleventyConfig.addPassthroughCopy("./src/robots.txt");

  eleventyConfig.addWatchTarget("./src/_includes/partials/");

  eleventyConfig.setBrowserSyncConfig({
    files: "./_site/**/*",
    reloadDelay: 250,
  });

  const now = new Date();
  const services = (service) => service.date <= now && !service.data.draft;

  eleventyConfig.addCollection("services", (collection) => {
    return [...collection.getFilteredByGlob("./src/services/*.md").filter(services)].reverse();
  });

  eleventyConfig.addCollection("testimonials", (collection) => {
    return collection
      .getFilteredByGlob("./src/testimonials/*.md")
      .filter((testimonial) => !testimonial.data.draft)
      .reverse();
  });

  eleventyConfig.addFilter("stripTrailingSlash", (url) => url.replace(/\/$/, ""));

  return {
    dir: {
      input: "src",
      includes: "_includes",
      layouts: "_includes",
    },
    templateFormats: ["html", "njk", "md"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
};
