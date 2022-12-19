import typescript from "@rollup/plugin-typescript";
import path from "path";
import { defineConfig } from "rollup";
import esbuild from "rollup-plugin-esbuild";

const { root } = path.parse(process.cwd());

function external(id) {
  return !id.startsWith(".") && !id.startsWith(root);
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
    plugins: [
      esbuild({
        target: "esnext",
        tsconfig: path.resolve("./tsconfig.json"),
      }),
    ],
  });
}

/**
 * @param {string} input
 * @param {string} output
 */
function createDeclaration(input, output) {
  return defineConfig({
    input,
    output: {
      dir: output,
    },
    external,
    plugins: [
      typescript({
        outDir: output,
        declaration: true,
        emitDeclarationOnly: true,
      }),
    ],
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
    plugins: [typescript()],
  });
}

export default [
  createDeclaration(`src/index.ts`, "dist"),
  createCJSConfig("src/index.ts", "dist/index"),
  createESMConfig("src/index.ts", "dist/esm/index.js"),
  createESMConfig("src/index.ts", "dist/esm/index.mjs"),
];
