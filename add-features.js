// Script to automatically add dark mode and features to all HTML files
const fs = require('fs');
const path = require('path');

const htmlFiles = [
  'public/index.html',
  'public/login.html',
  'public/menu.html',
  'public/dashboard.html',
  'public/admin.html',
  'public/checkout.html'
];

const cssLink = '<link rel="stylesheet" href="/dark-mode.css">';
const jsScript = '<script src="/features.js"></script>';

htmlFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`❌ File not found: ${file}`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Check if already added
  if (content.includes('dark-mode.css') && content.includes('features.js')) {
    console.log(`✅ Already added to: ${file}`);
    return;
  }
  
  // Add CSS link before </head>
  if (!content.includes('dark-mode.css')) {
    content = content.replace('</head>', `${cssLink}\n</head>`);
  }
  
  // Add JS script before </body>
  if (!content.includes('features.js')) {
    content = content.replace('</body>', `${jsScript}\n</body>`);
  }
  
  // Write back
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ Features added to: ${file}`);
});

console.log('\n🎉 Done! All features have been added to your HTML files.');
console.log('📝 Restart your server: node server.js');
console.log('🌐 Open: http://localhost:3000');
