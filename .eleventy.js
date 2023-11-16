// Path for blog posts
const POSTS_PATH = "src/posts";

module.exports = function (config) {
  // Global variables
  config.addGlobalData(
    "siteUrl",
    process.env.SITE_URL || "http://localhost:8080"
  );

  // Collection of posts in reverse date order
  config.addCollection("posts", (collection) =>
    collection
      .getFilteredByGlob(`${POSTS_PATH}/**/*.md`)
      .filter((post) => !!post.data.published)
      .sort((a, b) => b.data.publishedAt - a.data.publishedAt)
  );

  // Collection for sitemap generation
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

  // Date format filter
  config.addFilter("date", (value) => {
    return new Date(value).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  });

  // Copy static files
  config.addPassthroughCopy("src/robots.txt");
  config.addPassthroughCopy("src/assets/**.*");
  config.addPassthroughCopy("static/**/**.*");

  // Plugins
  config.addPlugin(require("@11ty/eleventy-plugin-syntaxhighlight"));

  return {
    dir: {
      input: "src/",
      output: "dist",
      layouts: "layouts",
    },
  };
};
