import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig((args) => {
  let base = '/';
  let generateScopedName = '[name]__[local]--[hash:base64:5]';

  if (args.mode === 'production') {
    base = '/url-decoder/';
    generateScopedName = '[hash:base64:5]';
  }

  return {
    base,
    plugins: [
      vue(),
    ],
    css: {
      modules: {
        localsConvention: 'camelCaseOnly',
        generateScopedName,
      },
    },
  };
});
