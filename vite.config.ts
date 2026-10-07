import { defineConfig } from "vite-plus";

export default defineConfig({
  staged: {
    "*": "vp check --fix --no-error-on-unmatched-pattern",
  },
  pack: {
    entry: ["src/index.ts", "src/cesium/index.ts", "src/mapbox/index.ts"],
    dts: {
      generator: "tsgo",
    },
    deps: {
      // tsdown <0.23 compatibility: resolve external dependency subpaths.
      // Remove to preserve subpath imports as written (the new default).
      // https://tsdown.dev/options/dependencies#deps-resolvedepsubpath
      resolveDepSubpath: true,
      neverBundle: [/^(cesium|mapbox-gl)(\/|$)/],
    },
    exports: {
      customExports: {
        ".": {
          types: "./dist/index.d.mts",
          import: "./dist/index.mjs",
        },
        "./cesium": {
          types: "./dist/cesium/index.d.mts",
          import: "./dist/cesium/index.mjs",
        },
        "./mapbox": {
          types: "./dist/mapbox/index.d.mts",
          import: "./dist/mapbox/index.mjs",
        },
      },
    },
  },
  lint: {
    ignorePatterns: [".agents/skills/**"],
    options: {
      typeAware: true,
      typeCheck: true,
    },
  },
  fmt: {
    ignorePatterns: [".agents/skills/**"],
  },
});
