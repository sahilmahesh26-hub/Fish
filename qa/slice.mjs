import sharp from 'sharp'
const [input, prefix, countArg = '5'] = process.argv.slice(2)
const count = Number(countArg)
const meta = await sharp(input).metadata()
const sliceHeight = Math.ceil(meta.height / count)
for (let i = 0; i < count; i += 1) {
  const top = i * sliceHeight
  const height = Math.min(sliceHeight, meta.height - top)
  if (height <= 0) break
  await sharp(input)
    .extract({ left: 0, top, width: meta.width, height })
    .resize({ width: Math.round(meta.width / 2) })
    .toFile(`${prefix}-${i}.png`)
}
console.log(`sliced ${input} (${meta.width}x${meta.height}) into ${count}`)
