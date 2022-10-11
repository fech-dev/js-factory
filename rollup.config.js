const typescript = require("rollup-plugin-typescript2");
const pkg = require("./package.json");
const { uglify } = require("rollup-plugin-uglify");

module.exports = {
  input: "src/index.ts",
  output: [
    { file: pkg.main, format: "cjs" },
    { file: pkg.module, format: "es" },
  ],
  plugins: [typescript({ typescript: require("typescript") }), uglify()],
};
