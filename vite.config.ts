import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig((args) => {
  const base = args.mode === 'production'
    ? '/url-decoder/'
    : '/';

  const generateScopedName = args.mode === 'production'
    ? '[hash:base64:5]'
    : '[name]__[local]--[hash:base64:5]';

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
