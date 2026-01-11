module.exports = function(eleventyConfig) {
  // Passthrough static assets from repo root to generated site
  eleventyConfig.addPassthroughCopy("styles.css");
  eleventyConfig.addPassthroughCopy("script.js");
  eleventyConfig.addPassthroughCopy("static");

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
