const sass = require('sass'); // Sass compiler
const globImporter = require('sass-glob-importer'); // Glob importer for Sass
const fs = require('fs'); // File system for saving output CSS file

// Compile SCSS to CSS
const result = sass.compile('scss/main.scss', {
    importer: globImporter(),
    style: 'compressed', // Optional: compress output CSS
});

// Write compiled CSS to a file
fs.writeFileSync('dist/main.css', result.css);
console.log('SCSS compiled successfully to dist/main.css');
