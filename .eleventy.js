module.exports = function (eleventyConfig) {
  eleventyConfig.setBrowserSyncConfig({
    files: './public/static/**/*.css',
  });

  return {
    dir: {
      input: 'source',
      output: 'public',
    },
  };
};