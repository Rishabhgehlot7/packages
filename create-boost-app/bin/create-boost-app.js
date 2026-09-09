#!/usr/bin/env node

const path = require('path');
const readline = require('readline');
const { scaffoldProject } = require('../src/scaffolder');

const banner = `
\x1b[35m  ██████╗  ██████╗  ██████╗ ███████╗████████╗\x1b[0m
\x1b[35m  ██╔══██╗██╔═══██╗██╔═══██╗██╔════╝╚══██╔══╝\x1b[0m
\x1b[36m  ██████╔╝██║   ██║██║   ██║███████╗   ██║   \x1b[0m
\x1b[36m  ██╔══██╗██║   ██║██║   ██║╚════██║   ██║   \x1b[0m
\x1b[34m  ██████╔╝╚██████╔╝╚██████╔╝███████║   ██║   \x1b[0m
\x1b[34m  ╚═════╝  ╚═════╝  ╚═════╝ ╚══════╝   ╚═╝   \x1b[0m
\x1b[1m\x1b[33m  ⚡ 1-Command D2C eCommerce Store Generator\x1b[0m
  \x1b[90mStorefront • Admin Panel • WordPress-Style Plugins • Indian GST\x1b[0m
`;

console.log(banner);

const args = process.argv.slice(2);
const defaultProjectName = args[0] || 'my-boost-store';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question, defaultValue) {
  return new Promise((resolve) => {
    rl.question(`\x1b[1m\x1b[32m?\x1b[0m ${question} \x1b[90m(${defaultValue})\x1b[0m: `, (ans) => {
      resolve(ans.trim() || defaultValue);
    });
  });
}

async function main() {
  try {
    let projectName = args[0];
    if (!projectName) {
      projectName = await ask('Project directory name', 'my-boost-store');
    }

    const brandTitle = await ask('Store Brand Title', 'Boost Aesthetic');

    console.log(`\n\x1b[36m⚡ Scaffolding full-stack D2C eCommerce project in ./${projectName}...\x1b[0m`);

    const targetDir = path.resolve(process.cwd(), projectName);
    scaffoldProject(targetDir, {
      storeName: projectName,
      brandTitle,
    });

    console.log(`\x1b[32m✔ Project files created successfully!\x1b[0m`);
    console.log(`\x1b[32m✔ Storefront & Admin Panel (/admin) generated!\x1b[0m`);
    console.log(`\x1b[32m✔ WordPress-Style Plugin Architecture configured!\x1b[0m`);
    console.log(`\x1b[32m✔ 15 @boostengine micro-packages wired up!\x1b[0m\n`);

    console.log(`\x1b[1mNext Steps:\x1b[0m`);
    console.log(`  \x1b[33mcd\x1b[0m ${projectName}`);
    console.log(`  \x1b[33mnpm install\x1b[0m`);
    console.log(`  \x1b[33mnpm run dev\x1b[0m\n`);

    console.log(`\x1b[1mEndpoints:\x1b[0m`);
    console.log(`  🌐 Storefront:   \x1b[36mhttp://localhost:3000\x1b[0m`);
    console.log(`  ⚡ Admin Panel:  \x1b[36mhttp://localhost:3000/admin\x1b[0m`);
    console.log(`  🧩 Plugins Hub:  \x1b[36mhttp://localhost:3000/admin/plugins\x1b[0m\n`);

    console.log(`\x1b[35mHappy building your D2C empire! 🚀\x1b[0m\n`);
  } catch (err) {
    console.error('\x1b[31mError generating project:\x1b[0m', err);
    process.exit(1);
  } finally {
    rl.close();
  }
}

main();
