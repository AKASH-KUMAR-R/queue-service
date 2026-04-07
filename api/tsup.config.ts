import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  outDir: "dist",
  clean: true,
  format: ["esm"],
  sourcemap: true,
  tsconfig: "tsconfig.json",
  target: "es2022",
});
