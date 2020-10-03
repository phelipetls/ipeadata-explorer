const { useBabelRc, override, addWebpackExternals } = require('customize-cra')

module.exports = override(
  useBabelRc(),
  addWebpackExternals({
    moment: "moment",
  })
);
