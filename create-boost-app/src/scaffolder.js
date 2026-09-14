const fs = require('fs');
const path = require('path');

// ─── Individual Templates ──────────────────────────────────────────────────────
const TEMPLATES = {
  'nextjs': {
    dir: 'templates/nextjs',
    label: 'Next.js 15 Full-Stack Store (Storefront + Admin Panel)',
    framework: 'Next.js',
    type: 'standalone',
  },
  'vite': {
    dir: 'templates/vite-store',
    label: 'Vite + React 18 Storefront',
    framework: 'Vite',
    type: 'frontend',
  },
  'backend-express': {
    dir: 'templates/backend-express',
    label: 'Express.js API Server (@boostengine/server pre-wired)',
    framework: 'Express',
    type: 'backend',
  },
  'expo-mobile': {
    dir: 'templates/expo-mobile',
    label: 'Expo React Native Mobile App',
    framework: 'Expo',
    type: 'frontend',
  },
};

// ─── Paired & Multi-Project Templates ─────────────────────────────────────────
// Full-stack pairs & suites scaffolded together into sibling directories
const PAIRS = {
  'web+app': {
    label: 'Next.js Web Store  +  Expo Mobile App  (Web + Mobile Pair)',
    projects: [
      { key: 'web',    role: 'Web Store (Next.js)',    template: 'nextjs',      suffix: '-web', titleSuffix: ' Web Store' },
      { key: 'mobile', role: 'Mobile App (Expo)',      template: 'expo-mobile', suffix: '-app', titleSuffix: ' Mobile App' },
    ],
  },
  'vite+express': {
    label: 'Vite Storefront  +  Express API  (Paired Full-Stack)',
    frontend: 'vite',
    backend: 'backend-express',
    frontendSuffix: '',          // e.g. my-store/
    backendSuffix: '-api',       // e.g. my-store-api/
    projects: [
      { key: 'frontend', role: 'Frontend (Vite)',  template: 'vite',            suffix: '',     titleSuffix: '' },
      { key: 'backend',  role: 'Backend (Express)', template: 'backend-express', suffix: '-api', titleSuffix: ' API' },
    ],
  },
  'expo+express': {
    label: 'Expo Mobile App  +  Express API  (Paired Full-Stack)',
    frontend: 'expo-mobile',
    backend: 'backend-express',
    frontendSuffix: '',          // e.g. my-app/
    backendSuffix: '-api',       // e.g. my-app-api/
    projects: [
      { key: 'frontend', role: 'Mobile App (Expo)', template: 'expo-mobile',     suffix: '',     titleSuffix: '' },
      { key: 'backend',  role: 'Backend (Express)', template: 'backend-express', suffix: '-api', titleSuffix: ' API' },
    ],
  },
  'omnichannel': {
    label: 'Web Store  +  Mobile App  +  Express API  (3-in-1 Complete Suite)',
    projects: [
      { key: 'web',     role: 'Web Store (Vite)',      template: 'vite',            suffix: '-web', titleSuffix: ' Web Store' },
      { key: 'mobile',  role: 'Mobile App (Expo)',      template: 'expo-mobile',     suffix: '-app', titleSuffix: ' Mobile App' },
      { key: 'backend', role: 'Backend API (Express)', template: 'backend-express', suffix: '-api', titleSuffix: ' API' },
    ],
  },
};

// ─── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Recursively copy a directory and its files
 */
function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();

  const IGNORE_LIST = ['node_modules', '.next', '.git', 'dist', '.turbo', 'package-lock.json'];

  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach((childItemName) => {
      if (IGNORE_LIST.includes(childItemName)) return;
      copyRecursiveSync(
        path.join(src, childItemName),
        path.join(dest, childItemName)
      );
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

/**
 * Replace {{PLACEHOLDERS}} in a file's content
 */
function replacePlaceholders(filePath, replacements) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  Object.entries(replacements).forEach(([key, value]) => {
    content = content.replaceAll(`{{${key}}}`, value);
  });
  fs.writeFileSync(filePath, content, 'utf8');
}

// ─── Single Template Scaffolder ────────────────────────────────────────────────

/**
 * Scaffold a single template into targetDir.
 *
 * @param {string} targetDir
 * @param {{ storeName: string, brandTitle: string, template: string }} options
 */
function scaffoldProject(targetDir, options = {}) {
  const storeName  = options.storeName  || path.basename(targetDir);
  const brandTitle = options.brandTitle || 'Boost D2C Store';
  const template   = options.template   || 'nextjs';

  // Validate
  if (!TEMPLATES[template]) {
    const valid = Object.keys(TEMPLATES).join(', ');
    throw new Error(`Unknown template "${template}". Valid options: ${valid}`);
  }

  const templateConfig = TEMPLATES[template];
  const templateDir = path.resolve(__dirname, '..', templateConfig.dir);

  if (!fs.existsSync(templateDir)) {
    throw new Error(
      `Template directory not found: ${templateDir}\n` +
      `Please report this at https://github.com/boostengine/boostengine/issues`
    );
  }

  // 1. Copy files
  copyRecursiveSync(templateDir, targetDir);

  // 2. Replace placeholders
  const replacements = {
    PROJECT_NAME: storeName.toLowerCase().replace(/[^a-z0-9-_]/g, '-'),
    BRAND_TITLE:  brandTitle,
    YEAR:         new Date().getFullYear().toString(),
  };

  const filesToReplace = [
    'package.json',
    '.env.example',
    '.env.local',
    'index.html',
    'src/server.ts',
    'src/main.tsx',
    'src/screens/HomeScreen.tsx',
    'src/components/HomePage.tsx',
    'src/app/page.tsx',
    'src/app/layout.tsx',
  ];

  filesToReplace.forEach((relPath) => {
    replacePlaceholders(path.join(targetDir, relPath), replacements);
  });

  // 3. Create .env.local from .env.example
  const envExamplePath = path.join(targetDir, '.env.example');
  const envLocalPath   = path.join(targetDir, '.env.local');
  if (fs.existsSync(envExamplePath) && !fs.existsSync(envLocalPath)) {
    fs.copyFileSync(envExamplePath, envLocalPath);
  }

  // 4. Generate README
  const readme = generateReadme(brandTitle, templateConfig, storeName, template);
  fs.writeFileSync(path.join(targetDir, 'README.md'), readme);

  return {
    success: true,
    targetDir,
    storeName,
    brandTitle,
    template,
    framework: templateConfig.framework,
    type: templateConfig.type,
  };
}

// ─── Paired Scaffolder ────────────────────────────────────────────────────────

/**
 * Scaffold a frontend + backend PAIR into two sibling directories.
 *
 * e.g. pair='vite+express', projectName='my-store'
 *  → my-store/       (Vite frontend)
 *  → my-store-api/   (Express backend)
 *
 * @param {string} baseDir   - Parent directory where both folders are created
 * @param {string} pair      - Key from PAIRS ('vite+express' | 'expo+express')
 * @param {{ storeName: string, brandTitle: string }} options
 * @returns {{ frontend: object, backend: object }}
 */
function scaffoldPair(baseDir, pair, options = {}) {
  const pairConfig = PAIRS[pair];
  if (!pairConfig) {
    const valid = Object.keys(PAIRS).join(', ');
    throw new Error(`Unknown pair "${pair}". Valid pairs: ${valid}`);
  }

  const storeName  = options.storeName  || 'my-boost-store';
  const brandTitle = options.brandTitle || 'Boost D2C Store';

  const results = {};
  const projects = pairConfig.projects || [
    { key: 'frontend', role: 'Frontend', template: pairConfig.frontend, suffix: pairConfig.frontendSuffix || '', titleSuffix: '' },
    { key: 'backend',  role: 'Backend',  template: pairConfig.backend,  suffix: pairConfig.backendSuffix || '-api', titleSuffix: ' API' },
  ];

  for (const p of projects) {
    const projName = storeName + p.suffix;
    const projDir  = path.join(baseDir, projName);
    const result   = scaffoldProject(projDir, {
      storeName:  projName,
      brandTitle: brandTitle + (p.titleSuffix || ''),
      template:   p.template,
    });
    results[p.key] = result;
  }

  return {
    pair,
    pairLabel: pairConfig.label,
    projects: results,
    // Backwards compatibility for existing 2-folder callers
    frontend: results.frontend || results.web,
    backend: results.backend || results.mobile,
  };
}

// ─── README Generator ─────────────────────────────────────────────────────────

function generateReadme(brandTitle, templateConfig, projectName, template) {
  const steps = getNextSteps(template, projectName);
  return `# ${brandTitle}

⚡ Generated with \`npx create-boost-app\` — **${templateConfig.label}**

## 🚀 Quick Start

\`\`\`bash
${steps.join('\n')}
\`\`\`

---

## 🧩 @boostengine Packages Included

This project is pre-wired with the @boostengine micro-package suite.
Visit [npmjs.com/org/boostengine](https://www.npmjs.com/org/boostengine) for full documentation.

---

© ${new Date().getFullYear()} ${brandTitle}. Powered by BoostEngine.
`;
}

function getNextSteps(template, projectName) {
  const base = [`cd ${projectName}`, 'npm install'];
  if (template === 'nextjs')          return [...base, 'npm run dev', '', '# Open: http://localhost:3000'];
  if (template === 'vite')            return [...base, 'npm run dev', '', '# Open: http://localhost:3000'];
  if (template === 'backend-express') return [...base, '# Fill in .env.local with your API keys', 'npm run dev', '', '# API Health: http://localhost:3001/api/health'];
  if (template === 'expo-mobile')     return [...base, 'npx expo start', '', '# Scan QR with Expo Go app'];
  return base;
}

// ─── Exports ──────────────────────────────────────────────────────────────────
module.exports = { scaffoldProject, scaffoldPair, TEMPLATES, PAIRS };
