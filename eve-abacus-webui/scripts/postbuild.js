const fs = require('fs');
const path = require('path');

const standaloneDir = path.join('.next', 'standalone');
const sourceStatic = path.join('.next', 'static');
const targetStatic = path.join(standaloneDir, '.next', 'static');

if (fs.existsSync(standaloneDir) && fs.existsSync(sourceStatic)) {
  fs.mkdirSync(path.dirname(targetStatic), { recursive: true });
  fs.cpSync(sourceStatic, targetStatic, { recursive: true });
}
