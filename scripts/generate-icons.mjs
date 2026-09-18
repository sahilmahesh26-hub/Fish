import sharp from 'sharp'
import { mkdirSync, writeFileSync } from 'fs'
import path from 'path'

/**
 * Generates the Finquiry icon set from one source SVG.
 *
 * TEMPORARY MARK. This is a clean branded "F" built from the locked palette,
 * not the final Finquiry logo. Replace `assets/brand/icon.svg` with the real
 * mark and re-run `node scripts/generate-icons.mjs` — every size regenerates
 * from that one file.
 */

const LINEN = '#F5F0E8'
const SCARLET = '#D91A2A'
const NAVY = '#081F33'

const markSvg = () => `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="112" fill="${SCARLET}"/>
  <path d="M188 132h168a12 12 0 0 1 12 12v44a12 12 0 0 1-12 12H248v56h92a12 12 0 0 1 12 12v44a12 12 0 0 1-12 12h-92v88a12 12 0 0 1-12 12h-48a12 12 0 0 1-12-12V144a12 12 0 0 1 12-12Z" fill="${LINEN}"/>
  <path d="M368 300c28-18 54-26 78-24v96c-24 2-50-6-78-24Z" fill="${NAVY}"/>
  <circle cx="404" cy="322" r="11" fill="${LINEN}"/>
</svg>`

const outDir = 'src/app'
const publicDir = 'public'
const brandDir = 'assets/brand'
mkdirSync(brandDir, { recursive: true })
mkdirSync(publicDir, { recursive: true })

writeFileSync(path.join(brandDir, 'icon.svg'), markSvg())
writeFileSync(path.join(outDir, 'icon.svg'), markSvg())

const source = Buffer.from(markSvg())

const sizes = [
  { file: `${outDir}/icon.png`, size: 512 },
  { file: `${outDir}/apple-icon.png`, size: 180 },
  { file: `${publicDir}/icon-192.png`, size: 192 },
  { file: `${publicDir}/icon-512.png`, size: 512 },
  { file: `${publicDir}/icon-32.png`, size: 32 },
  { file: `${publicDir}/icon-48.png`, size: 48 },
  { file: `${publicDir}/icon-maskable-512.png`, size: 512, maskable: true },
]

for (const { file, size, maskable } of sizes) {
  if (maskable) {
    // Maskable icons are cropped to the middle 80%, so the mark is inset.
    const inset = Math.round(size * 0.1)
    await sharp(source, { density: 512 })
      .resize(size - inset * 2, size - inset * 2)
      .extend({ top: inset, bottom: inset, left: inset, right: inset, background: SCARLET })
      .png()
      .toFile(file)
  } else {
    await sharp(source, { density: 512 }).resize(size, size).png().toFile(file)
  }
  console.log('wrote', file, `${size}x${size}`)
}

/**
 * favicon.ico with 16, 32 and 48px frames.
 *
 * Written by hand because sharp has no ICO encoder. The format is a 6-byte
 * header, one 16-byte directory entry per frame, then the payloads — ICO has
 * allowed embedded PNG since Vista.
 */
const icoSizes = [16, 32, 48]
const pngs = await Promise.all(
  icoSizes.map((size) => sharp(source, { density: 512 }).resize(size, size).png().toBuffer()),
)

const header = Buffer.alloc(6)
header.writeUInt16LE(0, 0)
header.writeUInt16LE(1, 2)
header.writeUInt16LE(icoSizes.length, 4)

let offset = 6 + 16 * icoSizes.length
const entries = icoSizes.map((size, index) => {
  const entry = Buffer.alloc(16)
  entry.writeUInt8(size, 0)
  entry.writeUInt8(size, 1)
  entry.writeUInt8(0, 2)
  entry.writeUInt8(0, 3)
  entry.writeUInt16LE(1, 4)
  entry.writeUInt16LE(32, 6)
  entry.writeUInt32LE(pngs[index].length, 8)
  entry.writeUInt32LE(offset, 12)
  offset += pngs[index].length
  return entry
})

writeFileSync(`${outDir}/favicon.ico`, Buffer.concat([header, ...entries, ...pngs]))
console.log('wrote', `${outDir}/favicon.ico`, '16/32/48')
