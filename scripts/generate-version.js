import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const publicDir = path.join(rootDir, 'public');

const now = new Date();
const timestamp = now.getTime();
const versionData = {
  version: `1.3.${timestamp}`,
  timestamp: timestamp,
  buildDate: now.toISOString(),
  message: 'Actualización automática del sistema Colmena Segura',
  forceReload: true,
};

fs.writeFileSync(
  path.join(publicDir, 'version.json'),
  JSON.stringify(versionData, null, 2),
  'utf-8'
);

console.log('✅ version.json generated with timestamp:', timestamp);
