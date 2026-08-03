const postcssNesting = require("postcss-nesting");
const postcssCustomMedia = require("postcss-custom-media");

module.exports = {
  plugins: [postcssNesting(), postcssCustomMedia()],
};
