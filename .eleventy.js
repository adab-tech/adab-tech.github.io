module.exports = function(eleventyConfig) {
  // Passthrough static assets from repo root to generated site
  eleventyConfig.addPassthroughCopy("styles.css");
  eleventyConfig.addPassthroughCopy("script.js");
  eleventyConfig.addPassthroughCopy("static");

  // Collections: posts and tag list
  eleventyConfig.addCollection("posts", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/posts/**/*.md").reverse();
  });

  eleventyConfig.addCollection("tagList", function(collectionApi) {
    const tags = new Set();
    collectionApi.getAll().forEach(item => {
      if (item.data.tags) {
        item.data.tags.forEach(tag => tags.add(tag));
      }
    });
    return [...tags].sort();
  });

  // Shortcodes or filters could be added here

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site"
    }
  };
};
