const { pnpPlugin } = require('@yarnpkg/esbuild-plugin-pnp');
const { build } = require('esbuild');

build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  format: 'esm',
  outfile: 'dist/index.js',
  plugins: [pnpPlugin()],
}).catch(() => process.exit(1));
