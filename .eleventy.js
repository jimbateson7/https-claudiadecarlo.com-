const yaml = require("js-yaml");
const { DateTime } = require("luxon");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const htmlmin = require("html-minifier");

module.exports = function (eleventyConfig) {
  // Disable automatic use of your .gitignore
  eleventyConfig.setUseGitIgnore(false);

  // Merge data instead of overriding
  eleventyConfig.setDataDeepMerge(true);

  // human readable date
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("dd LLL yyyy");
  });

  // Syntax Highlighting for Code blocks
  eleventyConfig.addPlugin(syntaxHighlight);

  // To Support .yaml Extension in _data
  eleventyConfig.addDataExtension("yaml", (contents) => yaml.load(contents));

  // Copy Static Files to /_site
  eleventyConfig.addPassthroughCopy({
    "./src/admin/config.yml": "./admin/config.yml",
    "./node_modules/alpinejs/dist/cdn.min.js": "./static/js/alpine.js",
    "./node_modules/prismjs/themes/prism-tomorrow.css": "./static/css/prism-tomorrow.css",
  });

  // Copy Image Folder to /_site
  eleventyConfig.addPassthroughCopy("./src/static/img");

  // Copy favicon to root of /_site
  eleventyConfig.addPassthroughCopy("./src/static/favicons");

  // Copy robots.txt
  eleventyConfig.addPassthroughCopy("./src/robots.txt");

  // ✅ Watch partials for rebuilds
  eleventyConfig.addWatchTarget("./src/_includes/partials/");

  // ✅ Optional: add reload delay to prevent premature reloads
  eleventyConfig.setBrowserSyncConfig({
    files: './_site/**/*',
    reloadDelay: 250,
  });

  const now = new Date();

  const services = (service) => service.date <= now && !service.data.draft;
  eleventyConfig.addCollection('services', (collection) => {
    return [...collection.getFilteredByGlob('./src/services/*.md').filter(services)].reverse();
  });

  eleventyConfig.addCollection('testimonials', (collection) => {
    return collection
      .getFilteredByGlob('./src/testimonials/*.md')
      .filter((testimonial) => !testimonial.data.draft)
      .reverse();
  });

  eleventyConfig.addFilter("stripTrailingSlash", (url) => {
    return url.replace(/\/$/, "");
  });

  // Minify HTML
  eleventyConfig.addTransform("htmlmin", function (content, outputPath) {
    if (outputPath.endsWith(".html")) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
      });
      return minified;
    }

    return content;
  });

  return {
    dir: {
      input: "src",
    },
    htmlTemplateEngine: "njk",
  };
};
