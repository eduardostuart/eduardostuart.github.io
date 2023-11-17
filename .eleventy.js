// Utilities
const htmlmin = require("html-minifier");

const isProduction = process.env.NODE_ENV === "production";
const siteUrl = process.env.SITE_URL || "http://localhost:8080";
const siteVersion = process.env.SITE_VERSION || "unknown";
const aboutData = {
  work: require("./data/work.json"),
  projects: require("./data/projects.json"),
};

/** @param {import("@11ty/eleventy").UserConfig} config */
module.exports = function (config) {
  // Global variables
  config.addGlobalData("siteUrl", siteUrl);
  config.addGlobalData("siteVersion", siteVersion);
  config.addGlobalData("about", aboutData);

  // Add a new collection of posts
  // Filter out unpublished posts and sort by published date (descending)
  config.addCollection("posts", (collection) =>
    collection
      .getFilteredByGlob(`src/posts/**/*.md`)
      .filter((post) => !!post.data.published)
      .sort((a, b) => b.data.publishedAt - a.data.publishedAt)
  );

  // Collection to generate sitemap
  // This contains everything, pages, posts, etc.
  // Content that is not published or has sitemap set to false will be filtered out
  config.addCollection("sitemap", (collection) =>
    collection
      .getFilteredByGlob(`./src/**/*.{md,njk}`)
      .filter((post) => {
        if (!post.data.published) return false;
        if (post.data.sitemap === false) return false;
        return true;
      })
      .sort((a, b) => b.data.publishedAt - a.data.publishedAt)
  );

  // A filter to transform dates into more "human friendly" format
  config.addFilter("date", (value) => {
    return new Date(value).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  });

  // A filter to take the first n items of an array
  config.addFilter("take", (value, limit) => {
    if (Array.isArray(value)) {
      return value.slice(0, limit);
    }
    return value;
  });

  // Minify html output
  // More information here: https://www.11ty.dev/docs/config/#transforms
  // This will only run when building in production
  config.addTransform("htmlmin", function (content) {
    if (!isProduction) return content;
    if (this.page.outputPath && this.page.outputPath.endsWith(".html")) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
      });
      return minified;
    }
    return content;
  });

  // Copy static files
  config.addPassthroughCopy("src/robots.txt");
  config.addPassthroughCopy("src/assets/**.*");
  config.addPassthroughCopy("static/**/**.*");

  // Plugins
  config.addPlugin(require("@11ty/eleventy-plugin-syntaxhighlight"), {
    templateFormats: ["njk", "md"],
    errorOnInvalidLanguage: false,
  });
  config.addPlugin(require("eleventy-plugin-youtube-embed"), {
    allowFullscreen: true,
    lazy: true,
    modestBranding: true,
  });

  return {
    // Custom folder directories
    // Instead of _site it will be dist as output
    //
    // Setup layouts folder so it won't be generated as a page
    // includes and layouts are relative to input
    // https://www.11ty.dev/docs/config/#example-1
    dir: {
      input: "src/",
      output: "dist",
      includes: "includes",
      layouts: "layouts",
    },
  };
};
