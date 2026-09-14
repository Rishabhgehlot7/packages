#!/usr/bin/env node

const path = require('path');
const readline = require('readline');
const { scaffoldProject, scaffoldPair, TEMPLATES, PAIRS } = require('../src/scaffolder');

// ─── Banner ────────────────────────────────────────────────────────────────────
const banner = `
\x1b[35m  ██████╗  ██████╗  ██████╗ ███████╗████████╗\x1b[0m
\x1b[35m  ██╔══██╗██╔═══██╗██╔═══██╗██╔════╝╚══██╔══╝\x1b[0m
\x1b[36m  ██████╔╝██║   ██║██║   ██║███████╗   ██║   \x1b[0m
\x1b[36m  ██╔══██╗██║   ██║██║   ██║╚════██║   ██║   \x1b[0m
\x1b[34m  ██████╔╝╚██████╔╝╚██████╔╝███████║   ██║   \x1b[0m
\x1b[34m  ╚═════╝  ╚═════╝  ╚═════╝ ╚══════╝   ╚═╝   \x1b[0m
\x1b[1m\x1b[33m  ⚡ The Complete eCommerce Scaffold Tool\x1b[0m
  \x1b[90mFull-Stack • Frontend+Backend Pairs • Mobile\x1b[0m
`;

console.log(banner);

// ─── Parse CLI Args ────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
let templateFlag = null;
let projectNameArg = null;

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--template' && args[i + 1]) {
    templateFlag = args[i + 1];
    i++;
  } else if (!args[i].startsWith('--')) {
    projectNameArg = args[i];
  }
}

// ─── Readline helpers ─────────────────────────────────────────────────────────
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

function ask(question, defaultValue) {
  return new Promise((resolve) => {
    rl.question(`\x1b[1m\x1b[32m?\x1b[0m ${question} \x1b[90m(${defaultValue})\x1b[0m: `, (ans) => {
      resolve(ans.trim() || defaultValue);
    });
  });
}

// ─── Template Selection Menu ──────────────────────────────────────────────────
//
// Menu layout:
//   ── FULL-STACK (STANDALONE) ──
//   1. nextjs      — full-stack, one folder
//
//   ── PAIRED (FRONTEND + BACKEND) ──
//   2. vite+express   — scaffolds <name>/ + <name>-api/
//   3. expo+express   — scaffolds <name>/ + <name>-api/
//
//   ── STANDALONE (ADVANCED) ──
//   4. vite alone
//   5. backend-express alone
//   6. expo-mobile alone

const MENU = [
  // ── Full-stack standalone
  { type: 'standalone', key: 'nextjs',       display: 'Next.js 15  —  Full-Stack Store + Admin Panel  \x1b[90m(1 folder)\x1b[0m' },
  // ── Pairs & Suites
  { type: 'pair',       key: 'web+app',      display: 'Next.js Web Store  +  Expo Mobile App  \x1b[32m[WEB + APP]\x1b[0m  \x1b[90m(2 folders: web/ + app/)\x1b[0m' },
  { type: 'pair',       key: 'vite+express', display: 'Vite Store  +  Express API  \x1b[32m[PAIRED]\x1b[0m  \x1b[90m(2 folders: store/ + store-api/)\x1b[0m' },
  { type: 'pair',       key: 'expo+express', display: 'Expo Mobile  +  Express API  \x1b[32m[PAIRED]\x1b[0m  \x1b[90m(2 folders: app/ + app-api/)\x1b[0m' },
  { type: 'pair',       key: 'omnichannel',  display: 'Web Store  +  Mobile App  +  Express API  \x1b[35m[3-IN-1 SUITE]\x1b[0m  \x1b[90m(3 folders: web/ + app/ + api/)\x1b[0m' },
  // ── Individual (advanced users)
  { type: 'standalone', key: 'vite',             display: 'Vite Store only  \x1b[90m(frontend, no backend)\x1b[0m' },
  { type: 'standalone', key: 'backend-express',  display: 'Express API only  \x1b[90m(backend, no frontend)\x1b[0m' },
  { type: 'standalone', key: 'expo-mobile',      display: 'Expo Mobile only  \x1b[90m(mobile, no backend)\x1b[0m' },
];

function showMenu() {
  console.log('\n\x1b[1mChoose a stack:\x1b[0m\n');

  console.log('  \x1b[90m── Full-Stack Standalone ──\x1b[0m');
  MENU.slice(0, 1).forEach((item, i) => {
    console.log(`  \x1b[33m${i + 1}\x1b[0m. ${item.display}`);
  });

  console.log('\n  \x1b[90m── Paired Stacks & Suites (Recommended) ──\x1b[0m');
  MENU.slice(1, 5).forEach((item, i) => {
    console.log(`  \x1b[33m${i + 2}\x1b[0m. ${item.display}`);
  });

  console.log('\n  \x1b[90m── Standalone (Advanced) ──\x1b[0m');
  MENU.slice(5).forEach((item, i) => {
    console.log(`  \x1b[33m${i + 6}\x1b[0m. ${item.display}`);
  });

  console.log('');
}

function askMenu() {
  showMenu();
  return new Promise((resolve) => {
    rl.question('\x1b[1m\x1b[32m?\x1b[0m Enter number \x1b[90m(1)\x1b[0m: ', (ans) => {
      const idx = parseInt(ans.trim(), 10);
      if (!isNaN(idx) && idx >= 1 && idx <= MENU.length) {
        return resolve(MENU[idx - 1]);
      }
      // Check if they typed a key directly
      const byKey = MENU.find(m => m.key === ans.trim());
      if (byKey) return resolve(byKey);
      // Default: nextjs standalone
      resolve(MENU[0]);
    });
  });
}

// ─── Resolve --template flag to menu item ─────────────────────────────────────
const FLAG_ALIASES = {
  'next+expo': 'web+app',
  'app+web': 'web+app',
  'all': 'omnichannel',
  'trio': 'omnichannel',
  'full-suite': 'omnichannel',
  'backend': 'backend-express',
  'expo': 'expo-mobile',
};

function resolveFlag(flag) {
  const normalized = FLAG_ALIASES[flag] || flag;
  const byKey = MENU.find(m => m.key === normalized);
  if (byKey) return byKey;
  return null;
}

// ─── Success Output ───────────────────────────────────────────────────────────
function printPairSuccess(pairResult, projectName, brandTitle) {
  const pairConfig = PAIRS[pairResult.pair];
  const projects = (pairConfig && pairConfig.projects) || [
    { key: 'frontend', role: 'Frontend', template: pairResult.frontend.template },
    { key: 'backend',  role: 'Backend',  template: pairResult.backend.template },
  ];

  console.log(`\n\x1b[32m✔ ${projects.length} projects scaffolded successfully!\x1b[0m`);
  console.log(`\x1b[32m✔ ${pairResult.pairLabel}\x1b[0m\n`);

  projects.forEach((p) => {
    const res = (pairResult.projects && pairResult.projects[p.key]) ||
      (p.key === 'frontend' ? pairResult.frontend : pairResult.backend);
    const folder = path.basename(res.targetDir);

    console.log(`\x1b[1m${p.role || p.key.toUpperCase()} — \x1b[36m${folder}/\x1b[0m\x1b[0m`);
    console.log(`  \x1b[33mcd\x1b[0m ${folder}`);
    console.log(`  \x1b[33mnpm install\x1b[0m`);

    if (p.template === 'nextjs') {
      console.log(`  \x1b[33mnpm run dev\x1b[0m`);
      console.log(`  # Open: \x1b[36mhttp://localhost:3000\x1b[0m (Storefront & /admin)`);
    } else if (p.template === 'vite') {
      console.log(`  \x1b[33mnpm run dev\x1b[0m`);
      console.log(`  # Open: \x1b[36mhttp://localhost:3000\x1b[0m`);
    } else if (p.template === 'expo-mobile') {
      console.log(`  \x1b[33mnpx expo start\x1b[0m`);
      console.log(`  # Scan QR with Expo Go app`);
    } else if (p.template === 'backend-express') {
      console.log(`  \x1b[90m# Fill in ${folder}/.env.local with API keys\x1b[0m`);
      console.log(`  \x1b[33mnpm run dev\x1b[0m`);
      console.log(`  # API Health: \x1b[36mhttp://localhost:3001/api/health\x1b[0m`);
      console.log(`  # Payments:   \x1b[36mhttp://localhost:3001/api/payments/*\x1b[0m`);
      console.log(`  # Shipping:   \x1b[36mhttp://localhost:3001/api/shipping/*\x1b[0m`);
    }
    console.log('');
  });

  console.log(`\x1b[90mTip: Open each folder in separate terminal tabs side-by-side!\x1b[0m`);
  console.log(`\x1b[35mHappy building ${brandTitle}! 🚀\x1b[0m\n`);
}

function printStandaloneSuccess(result, projectName, brandTitle) {
  const { template } = result;
  const cfg = TEMPLATES[template];

  console.log(`\n\x1b[32m✔ Project scaffolded successfully!\x1b[0m`);
  console.log(`\x1b[32m✔ ${cfg.label}\x1b[0m\n`);

  console.log(`\x1b[1mNext Steps:\x1b[0m`);
  console.log(`  \x1b[33mcd\x1b[0m ${projectName}`);
  console.log(`  \x1b[33mnpm install\x1b[0m`);

  if (template === 'nextjs') {
    console.log(`  \x1b[33mnpm run dev\x1b[0m\n`);
    console.log(`\x1b[1mEndpoints:\x1b[0m`);
    console.log(`  🌐 Storefront:  \x1b[36mhttp://localhost:3000\x1b[0m`);
    console.log(`  ⚡ Admin Panel: \x1b[36mhttp://localhost:3000/admin\x1b[0m`);
    console.log(`  🧩 Plugins Hub: \x1b[36mhttp://localhost:3000/admin/plugins\x1b[0m`);
  } else if (template === 'vite') {
    console.log(`  \x1b[33mnpm run dev\x1b[0m\n`);
    console.log(`  🌐 \x1b[36mhttp://localhost:3000\x1b[0m`);
  } else if (template === 'backend-express') {
    console.log(`  \x1b[90m# Fill in .env.local with your API keys\x1b[0m`);
    console.log(`  \x1b[33mnpm run dev\x1b[0m\n`);
    console.log(`\x1b[1mAPI Endpoints:\x1b[0m`);
    console.log(`  ❤️  Health:    \x1b[36mhttp://localhost:3001/api/health\x1b[0m`);
    console.log(`  💳 Payments:  \x1b[36mhttp://localhost:3001/api/payments/*\x1b[0m`);
    console.log(`  🚚 Shipping:  \x1b[36mhttp://localhost:3001/api/shipping/*\x1b[0m`);
    console.log(`  🔐 Auth:      \x1b[36mhttp://localhost:3001/api/auth/*\x1b[0m`);
  } else if (template === 'expo-mobile') {
    console.log(`  \x1b[33mnpx expo start\x1b[0m\n`);
    console.log(`  📱 Scan QR with Expo Go app`);
    console.log(`  🤖 Android: \x1b[36mnpx expo start --android\x1b[0m`);
    console.log(`  🍎 iOS:     \x1b[36mnpx expo start --ios\x1b[0m`);
  }

  console.log(`\n\x1b[35mHappy building ${brandTitle}! 🚀\x1b[0m\n`);
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  try {
    // 1. Project name
    let projectName = projectNameArg;
    if (!projectName) {
      projectName = await ask('Project name', 'my-boost-store');
    }

    // 2. Brand title
    const brandTitle = await ask('Brand title', 'Boost Aesthetic');

    // 3. Menu selection
    let menuItem;
    if (templateFlag) {
      menuItem = resolveFlag(templateFlag);
      if (!menuItem) {
        console.error(`\n\x1b[31m✖ Unknown template "${templateFlag}"\x1b[0m`);
        console.log('Valid options: ' + MENU.map(m => m.key).join(', ') + '\n');
        process.exit(1);
      }
      console.log(`\x1b[36m  Using: ${menuItem.display}\x1b[0m`);
    } else {
      menuItem = await askMenu();
    }

    const cwd = process.cwd();

    // ── PAIR ──────────────────────────────────────────────────────────────────
    if (menuItem.type === 'pair') {
      console.log(`\n\x1b[36m⚡ Scaffolding pair: ${PAIRS[menuItem.key].label}...\x1b[0m\n`);

      const result = scaffoldPair(cwd, menuItem.key, {
        storeName: projectName,
        brandTitle,
      });

      printPairSuccess(result, projectName, brandTitle);

    // ── STANDALONE ────────────────────────────────────────────────────────────
    } else {
      const targetDir = path.resolve(cwd, projectName);
      console.log(`\n\x1b[36m⚡ Scaffolding ${TEMPLATES[menuItem.key].label} in ./${projectName}...\x1b[0m\n`);

      const result = scaffoldProject(targetDir, {
        storeName: projectName,
        brandTitle,
        template: menuItem.key,
      });

      printStandaloneSuccess(result, projectName, brandTitle);
    }

  } catch (err) {
    console.error('\n\x1b[31m✖ Error:\x1b[0m', err.message || err);
    process.exit(1);
  } finally {
    rl.close();
  }
}

main();
