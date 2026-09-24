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

// ─── Available Feature Plugins ────────────────────────────────────────────────
const FEATURES = {
  'payments': {
    pkg: '@boostengine/payments',
    name: '💳 Payments (Razorpay, PhonePe, COD)',
    default: true,
  },
  'shipping': {
    pkg: '@boostengine/shipping',
    name: '🚚 Shipping & Tracking (Shiprocket)',
    default: true,
  },
  'auth': {
    pkg: '@boostengine/auth',
    name: '🔐 Phone OTP Authentication',
    default: true,
  },
  'invoicing': {
    pkg: '@boostengine/invoicing',
    name: '🧾 Indian GST Invoicing & PDFs',
    default: true,
  },
  'coupons': {
    pkg: '@boostengine/coupons',
    name: '🎟️ Coupons & Discounts Engine',
    default: true,
  },
  'returns': {
    pkg: '@boostengine/returns',
    name: '🔄 Returns & Refund Flow',
    default: false,
  },
  'notifications': {
    pkg: '@boostengine/notifications',
    name: '💬 WhatsApp & SMS Alerts',
    default: false,
  },
  'search': {
    pkg: '@boostengine/search',
    name: '🔍 Instant Product Search & Filters',
    default: true,
  },
  'wishlist': {
    pkg: '@boostengine/wishlist',
    name: '💖 Customer Wishlist',
    default: false,
  },
  'reviews': {
    pkg: '@boostengine/reviews',
    name: '⭐ Reviews & Ratings',
    default: false,
  },
  'loyalty': {
    pkg: '@boostengine/loyalty',
    name: '🎁 Loyalty Points & Rewards',
    default: false,
  },
  'deals': {
    pkg: '@boostengine/deals',
    name: '⚡ Flash Deals & Offers',
    default: false,
  },
  'recommendations': {
    pkg: '@boostengine/recommendations',
    name: '🤖 AI Recommendations',
    default: false,
  },
  'referrals': {
    pkg: '@boostengine/referrals',
    name: '🤝 Referral & Affiliate Engine',
    default: false,
  },
  'analytics': {
    pkg: '@boostengine/analytics',
    name: '📊 Store Analytics & Events',
    default: false,
  },
  'bundles': {
    pkg: '@boostengine/bundles',
    name: '📦 Product Combos & Tiered Bundles',
    default: false,
  },
  'reels': {
    pkg: '@boostengine/reels',
    name: '🎬 Shoppable 9:16 Video Reels',
    default: false,
  },
  'gamification': {
    pkg: '@boostengine/gamification',
    name: '🎡 Spin-to-Win & Scratch Cards',
    default: false,
  },
  'importer': {
    pkg: '@boostengine/importer',
    name: '📥 1-Click Shopify/Woo Catalog Importer',
    default: false,
  },
  'subscriptions': {
    pkg: '@boostengine/subscriptions',
    name: '🔁 Subscribe & Save Recurring Billing',
    default: false,
  },
  'currency': {
    pkg: '@boostengine/currency',
    name: '🌍 Multi-Currency & Geo-IP Engine',
    default: false,
  },
};

const FEATURE_PRESETS = {
  'all': Object.keys(FEATURES),
  'essentials': ['payments', 'shipping', 'auth', 'invoicing', 'coupons', 'search'],
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
  let template     = options.template   || 'nextjs';
  const pm         = options.pm         || 'npm';
  const git        = options.git === true;
  const install    = options.install === true;

  // Normalize `vite-store` flag value → `vite` template key
  if (template === 'vite-store') template = 'vite';

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

  // 3. Filter package.json dependencies based on selected features
  const selectedFeatureKeys = options.features === 'all' || !options.features
    ? Object.keys(FEATURES)
    : (Array.isArray(options.features) ? options.features : (FEATURE_PRESETS[options.features] || Object.keys(FEATURES)));

  const pkgPath = path.join(targetDir, 'package.json');
  if (fs.existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
      pkg.name = storeName.toLowerCase().replace(/[^a-z0-9-_]/g, '-');
      if (options.features && options.features !== 'all') {
        const allowedPkgs = new Set(selectedFeatureKeys.map(k => FEATURES[k] && FEATURES[k].pkg).filter(Boolean));
        if (pkg.dependencies) {
          for (const depName of Object.keys(pkg.dependencies)) {
            const isOptionalFeature = Object.values(FEATURES).some(f => f.pkg === depName);
            if (isOptionalFeature && !allowedPkgs.has(depName)) {
              delete pkg.dependencies[depName];
            }
          }
        }
      }
      fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2), 'utf8');
    } catch (e) {}
  }

  // 4. Generate boost.config.json
  const boostConfig = {
    storeName,
    brandTitle,
    framework: templateConfig.framework,
    template,
    features: {},
  };
  for (const [key, feat] of Object.entries(FEATURES)) {
    boostConfig.features[key] = {
      name: feat.name,
      package: feat.pkg,
      enabled: selectedFeatureKeys.includes(key),
    };
  }
  fs.writeFileSync(path.join(targetDir, 'boost.config.json'), JSON.stringify(boostConfig, null, 2), 'utf8');

  // 5. Create .env.local from .env.example
  const envExamplePath = path.join(targetDir, '.env.example');
  const envLocalPath   = path.join(targetDir, '.env.local');
  if (fs.existsSync(envExamplePath) && !fs.existsSync(envLocalPath)) {
    fs.copyFileSync(envExamplePath, envLocalPath);
  }

  // 6. Generate README
  const readme = generateReadme(brandTitle, templateConfig, storeName, template, pm);
  fs.writeFileSync(path.join(targetDir, 'README.md'), readme);

  // 7. Generate .gitignore
  const gitignorePath = path.join(targetDir, '.gitignore');
  if (!fs.existsSync(gitignorePath)) {
    fs.writeFileSync(gitignorePath, generateGitignore(), 'utf8');
  }

  return {
    success: true,
    targetDir,
    storeName,
    brandTitle,
    template,
    framework: templateConfig.framework,
    type: templateConfig.type,
    features: selectedFeatureKeys,
    pm,
    git,
    install,
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
 * @param {{ storeName: string, brandTitle: string, features?: string|string[] }} options
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
      features:   options.features,
      pm:         options.pm,
      git:        options.git,
      install:    options.install,
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

function installCmd(pm) {
  if (pm === 'pnpm') return 'pnpm install';
  if (pm === 'yarn') return 'yarn';
  if (pm === 'bun') return 'bun install';
  return 'npm install';
}

function runCmd(pm, script) {
  if (pm === 'pnpm') return `pnpm ${script}`;
  if (pm === 'yarn') return `yarn ${script}`;
  if (pm === 'bun') return `bun run ${script}`;
  return `npm run ${script}`;
}

function generateGitignore() {
  return [
    'node_modules',
    '.next',
    'dist',
    '.turbo',
    '.env',
    '.env.local',
    '.DS_Store',
    '*.log',
    'coverage',
  ].join('\n') + '\n';
}

function generateReadme(brandTitle, templateConfig, projectName, template, pm = 'npm') {
  const steps = getNextSteps(template, projectName, pm);
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

function getNextSteps(template, projectName, pm = 'npm') {
  const base = [`cd ${projectName}`, installCmd(pm)];
  if (template === 'nextjs')          return [...base, runCmd(pm, 'dev'), '', '# Open: http://localhost:3000'];
  if (template === 'vite')            return [...base, runCmd(pm, 'dev'), '', '# Open: http://localhost:3000'];
  if (template === 'backend-express') return [...base, '# Fill in .env.local with your API keys', runCmd(pm, 'dev'), '', '# API Health: http://localhost:3001/api/health'];
  if (template === 'expo-mobile')     return [...base, 'npx expo start', '', '# Scan QR with Expo Go app'];
  return base;
}

// ─── Exports ──────────────────────────────────────────────────────────────────
module.exports = { scaffoldProject, scaffoldPair, TEMPLATES, PAIRS, FEATURES, FEATURE_PRESETS };
