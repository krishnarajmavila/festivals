// Simple script to copy icon.svg as placeholder
// For production, you should use a proper tool like sharp or imagemagick to convert SVG to PNG
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.join(__dirname, 'public');
const iconSvg = path.join(publicDir, 'icon.svg');

// For now, we'll copy the SVG as both PNG files
// In a real app, you'd use a proper conversion tool
const sizes = [192, 512];

sizes.forEach(size => {
  const destPath = path.join(publicDir, `icon-${size}.png`);
  // Just copy SVG for now - browser will handle it
  // You can replace these with actual PNG files later
  fs.copyFileSync(iconSvg, destPath.replace('.png', '.svg'));
  console.log(`Created icon-${size}.svg (use PNG converter for production)`);
});

console.log('\nNote: For production, convert these SVG files to PNG using:');
console.log('- Online tools like cloudconvert.com');
console.log('- Or install sharp: npm install sharp');
