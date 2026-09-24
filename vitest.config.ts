// ─────────────────────────────────────────────────────────────────────────────
// vitest.config.ts
// Dev-only test runner config, added for lib/calculations/ppdState.test.ts
// (Sprint B3, PPD module). Mirrors tsconfig.json's "@/*" path alias so test
// files can import with the same paths the app code uses. Does not affect
// `next build` or the deployed site — vitest is a devDependency only.
// ─────────────────────────────────────────────────────────────────────────────

import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
})
