const fs = require('fs');
const path = require('path');

const standaloneDir = path.join('.next', 'standalone');
const sourceStatic = path.join('.next', 'static');
const targetStatic = path.join(standaloneDir, '.next', 'static');

if (fs.existsSync(standaloneDir) && fs.existsSync(sourceStatic)) {
  fs.mkdirSync(path.dirname(targetStatic), { recursive: true });
  fs.cpSync(sourceStatic, targetStatic, { recursive: true });
}

// Ensure styled-jsx is available in standalone build
const styledJsxSource = path.join('node_modules', 'styled-jsx');
const styledJsxTarget = path.join(standaloneDir, 'node_modules', 'styled-jsx');

if (fs.existsSync(styledJsxSource) && !fs.existsSync(styledJsxTarget)) {
  console.log('Copying styled-jsx to standalone build...');
  fs.mkdirSync(path.dirname(styledJsxTarget), { recursive: true });
  fs.cpSync(styledJsxSource, styledJsxTarget, { recursive: true });
}

// Copy other potentially missing dependencies
const criticalDeps = ['@swc/helpers'];
criticalDeps.forEach(dep => {
  const depSource = path.join('node_modules', dep);
  const depTarget = path.join(standaloneDir, 'node_modules', dep);
  
  if (fs.existsSync(depSource) && !fs.existsSync(depTarget)) {
    console.log(`Copying ${dep} to standalone build...`);
    fs.mkdirSync(path.dirname(depTarget), { recursive: true });
    fs.cpSync(depSource, depTarget, { recursive: true });
  }
});
