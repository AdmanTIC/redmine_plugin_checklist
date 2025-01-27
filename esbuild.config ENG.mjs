import esbuild from 'esbuild';
import postCssPlugin from 'esbuild-postcss';

const isProduction = process.env.NODE_ENV === 'production';

// Define a common build configuration
const commonConfig = {
  bundle: true,
  sourcemap: true,
  loader: { '.png': 'file', '.svg': 'file' },
  plugins: [postCssPlugin()],
  target: ['es2015'],
  logLevel: 'info',
  define: { 'process.env.NODE_ENV': isProduction ? '"production"' : '"development"' },
};

// JavaScript build configuration
esbuild.build({
  ...commonConfig,
  entryPoints: ['app/javascript/packs/index.tsx'],
  outdir: 'assets/javascripts', // Output directory
  outbase: 'app/javascript/packs', // Common path from entry point
  entryNames: '[name]', // Use the entry point filename for the output file
}).catch(() => process.exit(1));

// CSS build configuration
esbuild.build({
  ...commonConfig,
  entryPoints: ['app/javascript/packs/index.css'],
  outdir: 'assets/stylesheets',
  outbase: 'app/javascript/packs',
  entryNames: '[name]',
}).catch(() => process.exit(1));
