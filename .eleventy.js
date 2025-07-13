const { eleventyImageTransformPlugin } = require("@11ty/eleventy-img");
const yaml = require("js-yaml");
const { DateTime } = require("luxon");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const markdownIt = require("markdown-it");
const esbuild = require('esbuild');
const path = require("path");

module.exports = function(eleventyConfig) {
  eleventyConfig.addPlugin(eleventyImageTransformPlugin);
  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.addPlugin(pluginRss);

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

  eleventyConfig.addPassthroughCopy("./src/static/uploads");
  eleventyConfig.addPassthroughCopy("./src/static/favicons");
  eleventyConfig.addPassthroughCopy("./src/static/fonts");
  // Note: JS files are handled by esbuild via npm script, not passthrough

  eleventyConfig.addWatchTarget("./src/_includes/partials/");

  eleventyConfig.setBrowserSyncConfig({
    files: "./_site/**/*",
    reloadDelay: 250,
  });

  const path = require("path");

eleventyConfig.addGlobalData("eleventyComputed", {
  permalink: (data) => {
    if (data.permalink) return data.permalink;

    if (data.page && data.page.inputPath) {
      const inputPath = data.page.inputPath;
      let filePathStem = data.page.filePathStem; // e.g. "/en/404" or "/es/about"

      // Skip language prefixing for admin files
      if (inputPath.includes(`${path.sep}admin${path.sep}`)) {
        return data.page.filePathStem + "/";
      }

      if (inputPath.includes(`${path.sep}en${path.sep}`)) {
        // Remove leading /en from filePathStem
        if (filePathStem.startsWith("/en")) {
          filePathStem = filePathStem.slice(3); // remove "/en"
        }
        return `/en${filePathStem}/`;
      }
      if (inputPath.includes(`${path.sep}es${path.sep}`)) {
        // Remove leading /es from filePathStem
        if (filePathStem.startsWith("/es")) {
          filePathStem = filePathStem.slice(3); // remove "/es"
        }
        return `/es${filePathStem}/`;
      }
    }

    // Default fallback — no prefix
    return data.page.filePathStem + "/";
  },
  locale: (data) => {
    // Front matter locale takes absolute precedence - don't override if already set
    if (data.locale) return data.locale;
    
    // Fallback to path-based detection only if no front matter locale
    if (data.page && data.page.inputPath) {
      if (data.page.inputPath.includes(`${path.sep}es${path.sep}`)) return "es";
      if (data.page.inputPath.includes(`${path.sep}en${path.sep}`)) return "en";
    }
    return "en";
  }
});

  const now = new Date();

  const services = (service) => (!service.date || service.date <= now) && !service.data.draft;

  eleventyConfig.addCollection("services_en", (collection) => {
    return [...collection.getFilteredByGlob("./src/en/services/*.md").filter(services)].reverse();
  });

  eleventyConfig.addCollection("services_es", (collection) => {
    return [...collection.getFilteredByGlob("./src/es/services/*.md").filter(services)].reverse();
  });

  eleventyConfig.addCollection("testimonials_en", (collection) => {
    return collection
      .getFilteredByGlob("./src/en/testimonials/*.md")
      .filter((testimonial) => !testimonial.data.draft)
      .reverse();
  });

  eleventyConfig.addCollection("testimonials_es", (collection) => {
    return collection
      .getFilteredByGlob("./src/es/testimonials/*.md")
      .filter((testimonial) => !testimonial.data.draft)
      .reverse();
  });

  eleventyConfig.addCollection("posts_en", (collection) =>
    collection.getFilteredByGlob("./src/en/posts/*.md")
  );
  
  eleventyConfig.addCollection("posts_es", (collection) =>
    collection.getFilteredByGlob("./src/es/posts/*.md")
  );

  eleventyConfig.addCollection("sitemapPages", (collectionApi) => {
    return collectionApi.getAll().filter(page => {
      if (!page.url) return false;
      if (page.url.startsWith("/admin")) return false;
      if (page.url.startsWith("/static")) return false;
      if (page.url.endsWith(".js")) return false;
      if (page.data && page.data.draft) return false;
      return true;
    });
  });

  eleventyConfig.addFilter("stripTrailingSlash", (url) => url.replace(/\/$/, ""));

  eleventyConfig.addFilter("dateToIso", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toISODate();
  });

  eleventyConfig.addPairedShortcode("video", function (content, src) {
    return `
      <video class="aspect-video mx-auto w-full image-shadow rounded-lg" controls>
        <source src="${src}" type="video/mp4">
        ${content || "Your browser does not support the video tag."}
      </video>`;
  });

  eleventyConfig.addPairedShortcode("button", function (content, link, isExternal = false) {
    return `
      <a href="${link}" class="btn" ${isExternal ? 'target="_blank" rel="noopener noreferrer"' : ''}>
        ${content}${isExternal ? ' <span class="sr-only">(opens in a new tab)</span>' : ''}
      </a>`;
  });

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
