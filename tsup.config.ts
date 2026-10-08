import { defineConfig } from "tsup";
import fs from "node:fs";
import path from "node:path";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: true,
  clean: true,
  sourcemap: true,
  splitting: false,
  treeshake: true,
  minify: false,
  banner: {
    js: '"use client";',
  },
  onSuccess: async () => {
    // Ensure "use client" directive is at the very top of bundled files for Next.js
    const esmFile = path.resolve(__dirname, "dist/index.mjs");
    const cjsFile = path.resolve(__dirname, "dist/index.js");
    for (const f of [esmFile, cjsFile]) {
      if (fs.existsSync(f)) {
        const content = fs.readFileSync(f, "utf-8");
        if (!content.startsWith('"use client";')) {
          fs.writeFileSync(f, '"use client";\n' + content);
        }
      }
    }

    // Copy styles to dist/styles.css
    const srcCss = path.resolve(__dirname, "src/styles/kkhay.css");
    const distCss = path.resolve(__dirname, "dist/styles.css");
    if (fs.existsSync(srcCss)) {
      fs.copyFileSync(srcCss, distCss);
      console.log("⚡ Copied styles to dist/styles.css");
    }
  },
});

