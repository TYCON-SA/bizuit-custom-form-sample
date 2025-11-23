#!/usr/bin/env node

/**
 * Build script for Bizuit Custom Forms
 * Compiles forms with esbuild, marking React as external
 * so forms use the shared React instance from the runtime app
 */

const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

// Configuration
const config = {
  entryPoint: process.argv[2] || './src/index.tsx',
  outfile: process.argv[3] || './dist/form.js',
  formName: process.argv[4] || 'custom-form',
};

console.log('🔨 Building Bizuit Custom Form...');
console.log(`📄 Entry: ${config.entryPoint}`);
console.log(`📦 Output: ${config.outfile}`);
console.log(`🏷️  Name: ${config.formName}`);

async function buildForm() {
  try {
    // Ensure dist directory exists
    const distDir = path.dirname(config.outfile);
    if (!fs.existsSync(distDir)) {
      fs.mkdirSync(distDir, { recursive: true });
    }

    // Plugin to replace React and Bizuit packages with global references
    const globalExternalsPlugin = {
      name: 'global-externals',
      setup(build) {
        // Intercept React imports
        build.onResolve({ filter: /^react$/ }, args => {
          return { path: args.path, namespace: 'global-externals' }
        })

        build.onResolve({ filter: /^react-dom$/ }, args => {
          return { path: args.path, namespace: 'global-externals' }
        })

        build.onResolve({ filter: /^react\/jsx-runtime$/ }, args => {
          return { path: args.path, namespace: 'global-externals' }
        })

        build.onResolve({ filter: /^react\/jsx-dev-runtime$/ }, args => {
          return { path: args.path, namespace: 'global-externals' }
        })

        // Intercept Bizuit packages imports
        build.onResolve({ filter: /^@tyconsa\/bizuit-form-sdk$/ }, args => {
          return { path: args.path, namespace: 'global-externals' }
        })

        build.onResolve({ filter: /^@tyconsa\/bizuit-ui-components$/ }, args => {
          return { path: args.path, namespace: 'global-externals' }
        })

        // Return global references for these imports
        build.onLoad({ filter: /.*/, namespace: 'global-externals' }, args => {
          const contents = args.path === 'react'
            ? 'module.exports = window.React'
            : args.path === 'react-dom'
            ? 'module.exports = window.ReactDOM'
            : args.path.includes('jsx-runtime')
            ? 'module.exports = { jsx: window.React.createElement, jsxs: window.React.createElement, Fragment: window.React.Fragment }'
            : args.path === '@tyconsa/bizuit-form-sdk'
            ? 'module.exports = window.BizuitFormSDK'
            : args.path === '@tyconsa/bizuit-ui-components'
            ? 'module.exports = window.BizuitUIComponents'
            : ''

          return {
            contents,
            loader: 'js',
          }
        })
      },
    }

    const result = await esbuild.build({
      entryPoints: [config.entryPoint],
      bundle: true,
      format: 'esm', // ES Module format for dynamic import()
      outfile: config.outfile,
      platform: 'browser',
      target: ['es2020'],
      minify: true,
      sourcemap: true,

      // Use plugin to inject global references for React and Bizuit packages
      plugins: [globalExternalsPlugin],

      // Replace React imports with global references
      banner: {
        js: `
/* Bizuit Custom Form: ${config.formName} */
/* Built: ${new Date().toISOString()} */
/* React: window.React (external) */
/* ReactDOM: window.ReactDOM (external) */

// Use global React from runtime app
const React = window.React;
const ReactDOM = window.ReactDOM;
        `.trim(),
      },

      // Use classic JSX runtime to avoid jsx-runtime imports
      jsx: 'transform',
      jsxFactory: 'React.createElement',
      jsxFragment: 'React.Fragment',

      loader: {
        '.tsx': 'tsx',
        '.ts': 'ts',
        '.jsx': 'jsx',
        '.js': 'js',
        '.css': 'css',
        '.json': 'json',
      },

      logLevel: 'info',
    });

    // Get output file size
    const stats = fs.statSync(config.outfile);
    const sizeKB = (stats.size / 1024).toFixed(2);

    console.log('✅ Build successful!');
    console.log(`📊 Size: ${sizeKB} KB`);

    if (result.warnings.length > 0) {
      console.warn('⚠️  Warnings:');
      result.warnings.forEach(warning => console.warn(warning));
    }

    // Create metadata file
    const metadata = {
      formName: config.formName,
      version: process.env.npm_package_version || '1.0.0',
      builtAt: new Date().toISOString(),
      sizeBytes: stats.size,
      entryPoint: config.entryPoint,
      externals: [
        'react',
        'react-dom',
        '@tyconsa/bizuit-form-sdk',
        '@tyconsa/bizuit-ui-components',
      ],
    };

    const metadataPath = config.outfile.replace('.js', '.meta.json');
    fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
    console.log(`📝 Metadata: ${metadataPath}`);

    return { success: true, metadata };

  } catch (error) {
    console.error('❌ Build failed:');
    console.error(error);
    process.exit(1);
  }
}

// Run build
buildForm();
