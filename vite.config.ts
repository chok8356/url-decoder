import { viteCommonjs, esbuildCommonjs } from '@originjs/vite-plugin-commonjs';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig((args) => {
  const generateScopedName = args.mode === 'production'
    ? '[hash:base64:5]'
    : '[name]__[local]--[hash:base64:5]';
  return {
    plugins: [
      vue({
        template: {
          compilerOptions: {},
        },
      }),
      viteCommonjs(),
    ],
    css: {
      modules: {
        localsConvention: 'camelCaseOnly',
        generateScopedName,
      },
    },
    optimizeDeps: {
      esbuildOptions: {
        plugins: [
          esbuildCommonjs(['diff', 'diff_match_patch']),
        ],
      },
    },
  };
});
