/**
 * Mojibake checker.
 * Scans source files for common Chinese text that was decoded with the wrong
 * encoding, for example "缁煎悎" instead of readable Chinese.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SCAN_DIRS = [
  path.join(ROOT, 'frontend', 'src'),
  path.join(ROOT, 'backend', 'src'),
  path.join(ROOT, 'docs')
];
const EXTS = new Set(['.vue', '.ts', '.js', '.cjs', '.md']);

const GARBLE_RE = /[\uFFFD]|缁煎悎|鍚堟牸|濮瑰|径褍|鐫嗛|懘姘|鈹€|銆|鈩|閸|妴|缂佺|€|锛/;

const issues = [];

function scanDir(dir) {
  if (!fs.existsSync(dir)) return;

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      scanDir(fullPath);
      continue;
    }

    if (!EXTS.has(path.extname(entry.name))) continue;

    const lines = fs.readFileSync(fullPath, 'utf8').split(/\r?\n/);
    lines.forEach((line, index) => {
      if (!GARBLE_RE.test(line)) return;
      issues.push({
        file: path.relative(ROOT, fullPath),
        line: index + 1,
        content: line.trim().slice(0, 160)
      });
    });
  }
}

SCAN_DIRS.forEach(scanDir);

if (issues.length > 0) {
  console.error('Found possible mojibake text:');
  issues.forEach((issue) => {
    console.error(`  ${issue.file}:${issue.line}: ${issue.content}`);
  });
  process.exit(1);
}

console.log('No mojibake text found.');
