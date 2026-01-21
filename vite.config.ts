import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import dts from 'vite-plugin-dts'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isLibBuild = mode === 'lib'

  return {
    plugins: [
      react(),
      tailwindcss(),
      ...(isLibBuild
        ? [
            dts({
              include: ['src'],
              exclude: ['src/main.tsx'],
              outDir: 'dist',
              tsconfigPath: './tsconfig.app.json',
            }),
          ]
        : []),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    ...(isLibBuild && {
      build: {
        lib: {
          entry: path.resolve(__dirname, 'src/index.ts'),
          name: 'LLMArena',
          formats: ['es', 'umd'],
          fileName: (format) => `llm-arena.${format === 'es' ? 'js' : 'umd.cjs'}`,
        },
        rollupOptions: {
          external: ['react', 'react-dom', 'react/jsx-runtime'],
          output: {
            globals: {
              react: 'React',
              'react-dom': 'ReactDOM',
              'react/jsx-runtime': 'jsxRuntime',
            },
            assetFileNames: (assetInfo) => {
              if (assetInfo.name === 'style.css') return 'style.css'
              return assetInfo.name || 'asset'
            },
          },
        },
        sourcemap: true,
        cssCodeSplit: false,
      },
    }),
  }
})
