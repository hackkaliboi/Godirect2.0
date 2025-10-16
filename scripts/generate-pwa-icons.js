const fs = require('fs');
const path = require('path');

// Create placeholder icon files
const iconSizes = [192, 512];
const iconNames = ['android-chrome-192x192.png', 'android-chrome-512x512.png', 'apple-touch-icon.png'];

console.log('Creating placeholder icon files for PWA...');

// Create a simple blue square as placeholder icons
const createPlaceholderIcon = (size, filename) => {
  const svgContent = `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${size}" height="${size}" fill="#1e40af"/>
      <text x="50%" y="50%" fill="white" font-family="Arial" font-size="${size/4}" text-anchor="middle" dominant-baseline="middle">G</text>
    </svg>
  `;
  
  // In a real implementation, you would convert SVG to PNG
  // For now, we'll just create a text file to indicate the placeholder
  const placeholderPath = path.join(__dirname, '..', 'public', filename);
  fs.writeFileSync(placeholderPath, `Placeholder for ${filename} - ${size}x${size} icon`);
  console.log(`Created placeholder: ${filename}`);
};

// Create placeholder icons
iconNames.forEach((name, index) => {
  const size = iconSizes[index] || 192;
  createPlaceholderIcon(size, name);
});

console.log('PWA icon generation script completed.');
console.log('Note: In a production environment, you would replace these placeholders with actual logo files.');