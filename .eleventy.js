const sass = require('sass'); // `npm install node-sass`
const path = require("path");

module.exports = function(eleventyConfig) {

    // Recognize Sass as a "template languages"
eleventyConfig.addTemplateFormats("sass");

// Compile Sass
eleventyConfig.addExtension("sass", {
  outputFileExtension: "css",
  compile: async function (inputContent, inputPath) {
    // Skip files like _fileName.scss
    let parsed = path.parse(inputPath);
    if (parsed.name.startsWith("_")) {
      return;
    }

    // Run file content through Sass
    let result = sass.compileString(inputContent, {
      loadPaths: [parsed.dir || "."],
      syntax: "indented",
      sourceMap: false, // or true, your choice!
    });

    // Allow included files from @use or @import to
    // trigger rebuilds when using --incremental
    this.addDependencies(inputPath, result.loadedUrls);

    return async () => {
      return result.css;
    };
  },
});

    return {
        dir: {
            input: "source",
            includes: "_includes",
            output: "_site"
        },
        templateFormats: ["html"],
        // htmlTemplateEngine: "njk", , "md", "njk"
        // markdownTemplateEngine: "njk",
        // dataTemplateEngine: "njk"
    }

};


module.exports = function (eleventyConfig) {
  eleventyConfig.setBrowserSyncConfig({
    files: './build/css/**/*.css',
  });

  return {
    dir: {
      input: 'source',
      output: 'build',
    },
  };
};