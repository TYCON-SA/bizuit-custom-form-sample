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

    const result = await esbuild.build({
      entryPoints: [config.entryPoint],
      bundle: true,
      format: 'iife', // Immediately Invoked Function Expression
      globalName: `BizuitForm_${config.formName.replace(/-/g, '_')}`,
      outfile: config.outfile,
      platform: 'browser',
      target: ['es2020'],
      minify: true,
      sourcemap: true,

      // CRITICAL: Mark React and React-DOM as external
      // The runtime app will provide these via window.React and window.ReactDOM
      external: ['react', 'react-dom'],

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

      jsx: 'automatic',
      jsxImportSource: 'react',

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
      externals: ['react', 'react-dom'],
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
