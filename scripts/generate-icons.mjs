import { readFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

// Use tight viewBox so artwork fills the canvas (same crop used in app code)
let svg = readFileSync(join(root, 'public/logo/coinsprout-icon-vector.svg'), 'utf8')
svg = svg.replace('viewBox="0 0 512 512"', 'viewBox="125 128 305 305"')

mkdirSync(join(root, 'public/icons'), { recursive: true })

const targets = [
  { size: 32,  dest: join(root, 'app/icon.png') },
  { size: 180, dest: join(root, 'app/apple-icon.png') },
  { size: 192, dest: join(root, 'public/icons/icon-192.png') },
  { size: 512, dest: join(root, 'public/icons/icon-512.png') },
]

for (const { size, dest } of targets) {
  const dpi = Math.max(72, Math.ceil((size / 512) * 72 * 4))
  await sharp(Buffer.from(svg), { density: dpi })
    .resize(size, size)
    .png({ compressionLevel: 9 })
    .toFile(dest)
  console.log(`✓ ${dest.replace(root, '')} (${size}×${size})`)
}

console.log('\nDone.')
