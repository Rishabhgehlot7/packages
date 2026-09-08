const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '..', 'dist');

if (fs.existsSync(distDir)) {
  const files = ['index.cjs', 'index.mjs', 'index.js'];
  for (const file of files) {
    const filePath = path.join(distDir, file);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      if (!content.startsWith("'use client';") && !content.startsWith('"use client";')) {
        fs.writeFileSync(filePath, `'use client';\n` + content);
        console.log(`✅ Injected 'use client'; into dist/${file}`);
      }
    }
  }
}
