import resolve from "@rollup/plugin-node-resolve";
import path from "path";
import { defineConfig } from "rollup";
import esbuild from "rollup-plugin-esbuild";
import typescript from "rollup-plugin-ts";

const extensions = [".ts"];
const { root } = path.parse(process.cwd());

function external(id) {
  return !id.startsWith(".") && !id.startsWith(root);
}

/**
 * @param {string | string[]} target
 */
function getEsbuild(target) {
  return esbuild({
    minify: false,
    target,
    tsconfig: path.resolve("./tsconfig.json"),
  });
}

/**
 * @param {string} input
 * @param {string} output
 */
function createESMConfig(input, output) {
  return defineConfig({
    input,
    output: {
      file: output,
      format: "esm",
    },
    external,
    plugins: [resolve({ extensions }), getEsbuild("esnext")],
  });
}

/**
 * @param {string} input
 * @param {string} output
 */
function createCJSConfig(input, output) {
  return defineConfig({
    input,
    output: { file: `${output}.js`, format: "cjs" },
    external,
    plugins: [
      resolve({ extensions }),
      typescript({
        tsconfig: { declaration: true },
      }),
    ],
  });
}

export default [
  createCJSConfig("src/index.ts", "dist/index"),
  createESMConfig("src/index.ts", "dist/esm/index.js"),
  createESMConfig("src/index.ts", "dist/esm/index.mjs"),
];
