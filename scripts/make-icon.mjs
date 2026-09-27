import sharp from 'sharp'
import { mkdir } from 'node:fs/promises'

const source = 'public/brand.jpg'
const { data, info } = await sharp(source).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
const { width, height, channels } = info
const px = Buffer.from(data)

function idx(x, y) {
  return (y * width + x) * channels
}

function isWhite(r, g, b) {
  return r >= 248 && g >= 248 && b >= 248
}

const seen = new Uint8Array(width * height)
const queue = []
function push(x, y) {
  if (x < 0 || y < 0 || x >= width || y >= height) return
  const p = y * width + x
  if (seen[p]) return
  const i = idx(x, y)
  if (!isWhite(px[i], px[i + 1], px[i + 2])) return
  seen[p] = 1
  queue.push(x, y)
}

for (let x = 0; x < width; x++) {
  push(x, 0)
  push(x, height - 1)
}
for (let y = 0; y < height; y++) {
  push(0, y)
  push(width - 1, y)
}

for (let q = 0; q < queue.length; q += 2) {
  const x = queue[q]
  const y = queue[q + 1]
  const i = idx(x, y)
  px[i + 3] = 0
  push(x + 1, y)
  push(x - 1, y)
  push(x, y + 1)
  push(x, y - 1)
}

function isMatte(r, g, b) {
  const min = Math.min(r, g, b)
  const max = Math.max(r, g, b)
  return min > 205 && max - min < 46
}

const neighbors = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
]

for (let pass = 0; pass < 12; pass++) {
  const kill = []
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const i = idx(x, y)
      if (px[i + 3] === 0 || !isMatte(px[i], px[i + 1], px[i + 2])) continue
      const touchesHole = neighbors.some(([dx, dy]) => px[idx(x + dx, y + dy) + 3] === 0)
      if (touchesHole) kill.push(i)
    }
  }
  if (kill.length === 0) break
  for (const i of kill) px[i + 3] = 0
}

await mkdir('public', { recursive: true })
const base = sharp(px, { raw: { width, height, channels: 4 } }).png()

const filled = Buffer.from(px)
const qx = []
const qy = []
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    if (filled[idx(x, y) + 3] === 255) {
      qx.push(x)
      qy.push(y)
    }
  }
}
const visited = new Uint8Array(width * height)
for (let n = 0; n < qx.length; n++) visited[qy[n] * width + qx[n]] = 1
for (let n = 0; n < qx.length; n++) {
  const x = qx[n]
  const y = qy[n]
  const i = idx(x, y)
  for (const [dx, dy] of [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ]) {
    const nx = x + dx
    const ny = y + dy
    if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue
    const np = ny * width + nx
    if (visited[np]) continue
    visited[np] = 1
    const ni = idx(nx, ny)
    filled[ni] = filled[i]
    filled[ni + 1] = filled[i + 1]
    filled[ni + 2] = filled[i + 2]
    filled[ni + 3] = 255
    qx.push(nx)
    qy.push(ny)
  }
}
const solid = sharp(filled, { raw: { width, height, channels: 4 } }).png()

await base.clone().resize(512, 512).toFile('public/icon-512.png')
await base.clone().resize(192, 192).toFile('public/icon-192.png')
await base.clone().resize(32, 32).toFile('public/favicon-32.png')
await solid.clone().resize(512, 512).toFile('public/icon-maskable-512.png')
await solid.clone().resize(192, 192).toFile('public/icon-maskable-192.png')
await solid.clone().resize(180, 180).toFile('public/apple-touch-icon.png')

const transparent = await base.clone().raw().toBuffer({ resolveWithObject: true })
let cleared = 0
for (let i = 3; i < transparent.data.length; i += 4) {
  if (transparent.data[i] === 0) cleared++
}
console.log(`size ${width}x${height}, transparent pixels ${cleared}`)
