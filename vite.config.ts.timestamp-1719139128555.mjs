// vite.config.ts
import { sentryVitePlugin } from 'file:///C:/Users/shivs/Desktop/ActiveProjects/flowplane/node_modules/@sentry/vite-plugin/dist/esm/index.mjs';
import { defineConfig } from 'file:///C:/Users/shivs/Desktop/ActiveProjects/flowplane/node_modules/vite/dist/node/index.js';
import react from 'file:///C:/Users/shivs/Desktop/ActiveProjects/flowplane/node_modules/@vitejs/plugin-react/dist/index.mjs';
import {
  viteCommonjs,
  esbuildCommonjs,
} from 'file:///C:/Users/shivs/Desktop/ActiveProjects/flowplane/node_modules/@originjs/vite-plugin-commonjs/lib/index.js';
import path from 'path';
var __vite_injected_original_dirname =
  'C:\\Users\\shivs\\Desktop\\ActiveProjects\\flowplane';
var vite_config_default = defineConfig({
  plugins: [
    react(),
    viteCommonjs(),
    sentryVitePlugin({
      org: 'shiv-gm',
      project: 'flowplane-frontend',
    }),
    // MillionLint.vite()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__vite_injected_original_dirname, './src'),
    },
  },
  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  // prevent vite from obscuring rust errors
  clearScreen: false,
  // tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
  },
  // to make use of `TAURI_DEBUG` and other env variables
  // https://tauri.studio/v1/api/config#buildconfig.beforedevcommand
  envPrefix: ['VITE_', 'TAURI_'],
  build: {
    // Tauri supports es2021
    target: process.env.TAURI_PLATFORM == 'windows' ? 'chrome105' : 'safari13',
    // don't minify for debug builds
    minify: !process.env.TAURI_DEBUG ? 'esbuild' : false,
    // produce sourcemaps for debug builds
    sourcemap: true,
  },
  optimizeDeps: {
    esbuildOptions: {
      plugins: [
        esbuildCommonjs([
          'react-editor-js',
          '@react-editor-js/client',
          '@react-editor-js/server',
        ]),
      ],
    },
  },
});
export { vite_config_default as default };
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxzaGl2c1xcXFxEZXNrdG9wXFxcXEFjdGl2ZVByb2plY3RzXFxcXGZsb3dwbGFuZVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcc2hpdnNcXFxcRGVza3RvcFxcXFxBY3RpdmVQcm9qZWN0c1xcXFxmbG93cGxhbmVcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL3NoaXZzL0Rlc2t0b3AvQWN0aXZlUHJvamVjdHMvZmxvd3BsYW5lL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgc2VudHJ5Vml0ZVBsdWdpbiB9IGZyb20gJ0BzZW50cnkvdml0ZS1wbHVnaW4nO1xuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnO1xuaW1wb3J0IHsgdml0ZUNvbW1vbmpzLCBlc2J1aWxkQ29tbW9uanMgfSBmcm9tICdAb3JpZ2luanMvdml0ZS1wbHVnaW4tY29tbW9uanMnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgTWlsbGlvbkxpbnQgZnJvbSAnQG1pbGxpb24vbGludCc7XG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW1xuICAgIHJlYWN0KCksXG4gICAgdml0ZUNvbW1vbmpzKCksXG4gICAgc2VudHJ5Vml0ZVBsdWdpbih7XG4gICAgICBvcmc6ICdzaGl2LWdtJyxcbiAgICAgIHByb2plY3Q6ICdmbG93cGxhbmUtZnJvbnRlbmQnLFxuICAgIH0pLFxuICAgIC8vIE1pbGxpb25MaW50LnZpdGUoKVxuICBdLFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgICdAJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjJyksXG4gICAgfSxcbiAgfSxcbiAgLy8gVml0ZSBvcHRpb25zIHRhaWxvcmVkIGZvciBUYXVyaSBkZXZlbG9wbWVudCBhbmQgb25seSBhcHBsaWVkIGluIGB0YXVyaSBkZXZgIG9yIGB0YXVyaSBidWlsZGBcbiAgLy8gcHJldmVudCB2aXRlIGZyb20gb2JzY3VyaW5nIHJ1c3QgZXJyb3JzXG4gIGNsZWFyU2NyZWVuOiBmYWxzZSxcbiAgLy8gdGF1cmkgZXhwZWN0cyBhIGZpeGVkIHBvcnQsIGZhaWwgaWYgdGhhdCBwb3J0IGlzIG5vdCBhdmFpbGFibGVcbiAgc2VydmVyOiB7XG4gICAgcG9ydDogMTQyMCxcbiAgICBzdHJpY3RQb3J0OiB0cnVlLFxuICB9LFxuICAvLyB0byBtYWtlIHVzZSBvZiBgVEFVUklfREVCVUdgIGFuZCBvdGhlciBlbnYgdmFyaWFibGVzXG4gIC8vIGh0dHBzOi8vdGF1cmkuc3R1ZGlvL3YxL2FwaS9jb25maWcjYnVpbGRjb25maWcuYmVmb3JlZGV2Y29tbWFuZFxuICBlbnZQcmVmaXg6IFsnVklURV8nLCAnVEFVUklfJ10sXG4gIGJ1aWxkOiB7XG4gICAgLy8gVGF1cmkgc3VwcG9ydHMgZXMyMDIxXG4gICAgdGFyZ2V0OiBwcm9jZXNzLmVudi5UQVVSSV9QTEFURk9STSA9PSAnd2luZG93cycgPyAnY2hyb21lMTA1JyA6ICdzYWZhcmkxMycsXG4gICAgLy8gZG9uJ3QgbWluaWZ5IGZvciBkZWJ1ZyBidWlsZHNcbiAgICBtaW5pZnk6ICFwcm9jZXNzLmVudi5UQVVSSV9ERUJVRyA/ICdlc2J1aWxkJyA6IGZhbHNlLFxuICAgIC8vIHByb2R1Y2Ugc291cmNlbWFwcyBmb3IgZGVidWcgYnVpbGRzXG4gICAgc291cmNlbWFwOiB0cnVlLFxuICB9LFxuICBvcHRpbWl6ZURlcHM6IHtcbiAgICBlc2J1aWxkT3B0aW9uczoge1xuICAgICAgcGx1Z2luczogW1xuICAgICAgICBlc2J1aWxkQ29tbW9uanMoW1xuICAgICAgICAgICdyZWFjdC1lZGl0b3ItanMnLFxuICAgICAgICAgICdAcmVhY3QtZWRpdG9yLWpzL2NsaWVudCcsXG4gICAgICAgICAgJ0ByZWFjdC1lZGl0b3ItanMvc2VydmVyJyxcbiAgICAgICAgXSksXG4gICAgICBdLFxuICAgIH0sXG4gIH0sXG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBMlUsU0FBUyx3QkFBd0I7QUFDNVcsU0FBUyxvQkFBb0I7QUFDN0IsT0FBTyxXQUFXO0FBQ2xCLFNBQVMsY0FBYyx1QkFBdUI7QUFDOUMsT0FBTyxVQUFVO0FBSmpCLElBQU0sbUNBQW1DO0FBT3pDLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVM7QUFBQSxJQUNQLE1BQU07QUFBQSxJQUNOLGFBQWE7QUFBQSxJQUNiLGlCQUFpQjtBQUFBLE1BQ2YsS0FBSztBQUFBLE1BQ0wsU0FBUztBQUFBLElBQ1gsQ0FBQztBQUFBO0FBQUEsRUFFSDtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSyxLQUFLLFFBQVEsa0NBQVcsT0FBTztBQUFBLElBQ3RDO0FBQUEsRUFDRjtBQUFBO0FBQUE7QUFBQSxFQUdBLGFBQWE7QUFBQTtBQUFBLEVBRWIsUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sWUFBWTtBQUFBLEVBQ2Q7QUFBQTtBQUFBO0FBQUEsRUFHQSxXQUFXLENBQUMsU0FBUyxRQUFRO0FBQUEsRUFDN0IsT0FBTztBQUFBO0FBQUEsSUFFTCxRQUFRLFFBQVEsSUFBSSxrQkFBa0IsWUFBWSxjQUFjO0FBQUE7QUFBQSxJQUVoRSxRQUFRLENBQUMsUUFBUSxJQUFJLGNBQWMsWUFBWTtBQUFBO0FBQUEsSUFFL0MsV0FBVztBQUFBLEVBQ2I7QUFBQSxFQUNBLGNBQWM7QUFBQSxJQUNaLGdCQUFnQjtBQUFBLE1BQ2QsU0FBUztBQUFBLFFBQ1AsZ0JBQWdCO0FBQUEsVUFDZDtBQUFBLFVBQ0E7QUFBQSxVQUNBO0FBQUEsUUFDRixDQUFDO0FBQUEsTUFDSDtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
