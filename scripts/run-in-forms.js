#!/usr/bin/env node
/**
 * Runs one npm script in every form of this repository.
 *
 *   node scripts/run-in-forms.js test         (what `npm test` at the root does)
 *   node scripts/run-in-forms.js type-check
 *   node scripts/run-in-forms.js build
 *
 * WHY THIS EXISTS. `npm test` at the root used to be `echo "no test specified" && exit 1`, so the
 * repository offered a template that could not be tested at all. Each form lives in its own
 * directory with its own package.json, its own dependencies and its own Jest configuration, so
 * there is no single run that covers them all: this walks the directories instead.
 *
 * A form is any directory with a package.json. A form that does NOT declare the script is a
 * FAILURE, never a skip — a form with no tests is exactly what this is here to catch, and a
 * silent skip is how that goes unnoticed until someone deploys it.
 */
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const script = process.argv[2];

if (!script) {
  console.error('Usage: node scripts/run-in-forms.js <npm-script>');
  process.exit(2);
}

const root = path.resolve(__dirname, '..');

const forms = fs.readdirSync(root, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .filter((name) => !name.startsWith('.') && name !== 'node_modules' && name !== 'scripts')
  .filter((name) => fs.existsSync(path.join(root, name, 'package.json')))
  .sort();

if (forms.length === 0) {
  console.error('No forms found (a form is a directory with a package.json). Nothing to do.');
  process.exit(1);
}

console.log(`Forms found: ${forms.join(', ')}\n`);

const failed = [];

for (const form of forms) {
  const dir = path.join(root, form);
  const pkg = JSON.parse(fs.readFileSync(path.join(dir, 'package.json'), 'utf8'));

  if (!pkg.scripts || !pkg.scripts[script]) {
    console.error(`FAIL ${form}: its package.json declares no "${script}" script.`);
    console.error(`     A new form is copied from form-template, scripts included.\n`);
    failed.push(form);
    continue;
  }

  if (!fs.existsSync(path.join(dir, 'node_modules'))) {
    console.log(`--- ${form}: installing dependencies`);
    execFileSync('npm', ['install'], { cwd: dir, stdio: 'inherit' });
  }

  console.log(`--- ${form}: npm run ${script}`);
  try {
    execFileSync('npm', ['run', script], { cwd: dir, stdio: 'inherit' });
    console.log(`OK   ${form}\n`);
  } catch {
    console.error(`FAIL ${form}\n`);
    failed.push(form);
  }
}

if (failed.length > 0) {
  console.error(`\n"${script}" failed or was missing in: ${failed.join(', ')}`);
  process.exit(1);
}

console.log(`All ${forms.length} form(s): "${script}" OK.`);
