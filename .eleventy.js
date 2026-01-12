module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("styles.css");
  eleventyConfig.addPassthroughCopy("static");
  eleventyConfig.addPassthroughCopy({"assets/js/site.js":"assets/js/site.js"});

  eleventyConfig.addCollection("posts", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/posts/*.md").sort(function(a, b) {
      return b.date - a.date;
    });
  });

  return {
    templateFormats: ["md", "njk", "html"],
    pathPrefix: "/",
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    dir: {
      input: "src",
      includes: "_includes",
      layouts: "_includes",
      output: "_site"
    }
  };
};

