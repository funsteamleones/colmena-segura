import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const publicDir = path.join(rootDir, 'public');

const svgSource = path.join(publicDir, 'bee-icon.svg');

async function generate() {
  console.log('Generating PWA icons from:', svgSource);
  const svgBuffer = fs.readFileSync(svgSource);

  // 1. Copy to favicon.svg
  fs.writeFileSync(path.join(publicDir, 'favicon.svg'), svgBuffer);
  console.log('✅ favicon.svg updated');

  // 2. 192x192 PNG for Android PWA / Home Screen
  await sharp(svgBuffer)
    .resize(192, 192)
    .png({ quality: 95 })
    .toFile(path.join(publicDir, 'icon-192.png'));
  console.log('✅ icon-192.png generated (192x192)');

  // 3. 512x512 PNG for Splash & PWA Store
  await sharp(svgBuffer)
    .resize(512, 512)
    .png({ quality: 95 })
    .toFile(path.join(publicDir, 'icon-512.png'));
  console.log('✅ icon-512.png generated (512x512)');

  // 4. 180x180 PNG for Apple Touch Icon (iOS Safari Home Screen)
  await sharp(svgBuffer)
    .resize(180, 180)
    .png({ quality: 95 })
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));
  console.log('✅ apple-touch-icon.png generated (180x180)');

  // 5. Maskable Icon with 10% safe area for Android adaptive icons
  const paddedIcon = await sharp(svgBuffer)
    .resize(420, 420)
    .toBuffer();

  await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: { r: 15, g: 23, b: 42, alpha: 1 }, // #0F172A
    },
  })
    .composite([{ input: paddedIcon, top: 46, left: 46 }])
    .png({ quality: 95 })
    .toFile(path.join(publicDir, 'icon-maskable-512.png'));
  console.log('✅ icon-maskable-512.png generated (512x512 maskable)');

  console.log('🎉 All PWA app icons successfully generated!');
}

generate().catch(err => {
  console.error('Error generating icons:', err);
  process.exit(1);
});
