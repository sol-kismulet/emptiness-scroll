const fs = require('fs');
const path = require('path');

// Define sacred files to keep
const sacredFiles = new Set([
  'index.html',
  'enso.html',
  'stars.js',
  'orbits.js',
  'light.js',
  'init.js',
  'doxa.js',
  'enso.js',
  'offering.js',
  'glyphs.js',
  'lexicon.js',
  'order.js',
  'resonance.js',
  'invitation.js',
  'aether.js'
]);

// Create backup directory if it doesn't exist
const backupDir = path.join(__dirname, 'backup');
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir);
}

// Move everything not in the sacred list to backup
fs.readdirSync(__dirname).forEach(file => {
  if (!sacredFiles.has(file) && file !== 'backup') {
    const source = path.join(__dirname, file);
    const dest = path.join(backupDir, file);
    fs.renameSync(source, dest);
  }
});

console.log('Cleanup complete. Only sacred files remain.');
