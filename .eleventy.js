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

  eleventyConfig.addTemplateFormats('js');

  eleventyConfig.addExtension('js', {
    outputFileExtension: 'js',
    compile: async (content, path) => {
      if (path !== './src/static/js/index.js') {
        return;
      }

      return async () => {
        let output = await esbuild.build({
          target: 'es2020',
          entryPoints: [path],
          minify: true,
          bundle: true,
          write: false,
        });

        return output.outputFiles[0].text;
      }
    }
  });

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

  eleventyConfig.addWatchTarget("./src/_includes/partials/");

  eleventyConfig.setBrowserSyncConfig({
    files: "./_site/**/*",
    reloadDelay: 250,
  });

  eleventyConfig.addGlobalData("eleventyComputed", {
    permalink: (data) => {
      // Use explicit permalink if already set
      if (data.permalink) return data.permalink;
  
      // Detect language from input file path (adjust these to your folders)
      if (data.page && data.page.inputPath) {
        if (data.page.inputPath.includes(`${path.sep}en${path.sep}`)) {
          // prefix English pages with /en/
          return `/en${data.page.filePathStem}/`;
        }
        if (data.page.inputPath.includes(`${path.sep}es${path.sep}`)) {
          // prefix Spanish pages with /es/
          return `/es${data.page.filePathStem}/`;
        }
      }
  
      // Default fallback — no prefix
      return data.page.filePathStem + "/";
    }
  });

  const now = new Date();

  const services = (service) => service.date <= now && !service.data.draft;

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
