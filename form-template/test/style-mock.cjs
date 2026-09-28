// Jest cannot parse CSS. The real build inlines it (see the inline-css plugin in
// ../build-form.js); in a test it is irrelevant, so any `import './x.css'` resolves here.
module.exports = {};
