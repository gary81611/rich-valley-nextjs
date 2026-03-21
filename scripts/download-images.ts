import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { dirname, join } from 'path'

const BASE = join(__dirname, '..', 'public', 'images')

const images: Record<string, string> = {
  // Logos
  'https://lirp.cdn-website.com/312dda6a/dms3rep/multi/opt/richvalleylogo-1920w.png': 'logos/rva-logo.png',
  'https://lirp.cdn-website.com/312dda6a/dms3rep/multi/opt/logo4-1920w.png': 'logos/alpenglow-logo.png',
  // Fleet
  'https://lirp.cdn-website.com/312dda6a/dms3rep/multi/opt/pngimg.com---cadillac_PNG74-748w.png': 'fleet/escalade.png',
  'https://lirp.cdn-website.com/312dda6a/dms3rep/multi/opt/2025-Mercedes-Benz-Sprinter-3500-Cargo-front_53095_032_2400x1800_040-790w.png': 'fleet/sprinter.png',
  // Adventures
  'https://lirp.cdn-website.com/312dda6a/dms3rep/multi/opt/flyfishing-1920w.png': 'adventures/fly-fishing.png',
  'https://lirp.cdn-website.com/312dda6a/dms3rep/multi/opt/IMG_0110-1920w.jpg': 'adventures/paddle-boarding.jpg',
  'https://lirp.cdn-website.com/312dda6a/dms3rep/multi/opt/mountainbbiking-1920w.jpg': 'adventures/mountain-biking.jpg',
  'https://lirp.cdn-website.com/312dda6a/dms3rep/multi/opt/hiking-1920w.png': 'adventures/hiking.png',
  'https://lirp.cdn-website.com/312dda6a/dms3rep/multi/opt/scenicdrive-1920w.png': 'adventures/scenic-escalade.png',
  'https://lirp.cdn-website.com/312dda6a/dms3rep/multi/opt/horsebackriding-1920w.png': 'adventures/horseback-riding.png',
  'https://lirp.cdn-website.com/312dda6a/dms3rep/multi/opt/Rich-Valley-Ranch-October-2022-8725-1920w.jpeg': 'adventures/elevated-camping.jpeg',
  'https://lirp.cdn-website.com/312dda6a/dms3rep/multi/opt/IMG_4226-3863d226-1920w.jpeg': 'adventures/fly-fishing-action.jpeg',
  'https://lirp.cdn-website.com/312dda6a/dms3rep/multi/opt/image+%281%29-1920w.png': 'adventures/paddle-boarding-lake.png',
  'https://lirp.cdn-website.com/312dda6a/dms3rep/multi/opt/IMG_6512-1920w.jpeg': 'adventures/fishing-catch.jpeg',
  // Destinations
  'https://lirp.cdn-website.com/312dda6a/dms3rep/multi/opt/garden-of-the-gods-1920w.jpg': 'destinations/garden-of-the-gods.jpg',
  'https://lirp.cdn-website.com/312dda6a/dms3rep/multi/opt/denver-botanic-gardens-1920w.jpg': 'destinations/denver-botanic-gardens.jpg',
  'https://lirp.cdn-website.com/312dda6a/dms3rep/multi/opt/spectacular-1920w.jpg': 'destinations/red-rocks.jpg',
  'https://lirp.cdn-website.com/312dda6a/dms3rep/multi/opt/imag1087-largejpg-1920w.jpg': 'destinations/coors-field.jpg',
  'https://lirp.cdn-website.com/312dda6a/dms3rep/multi/opt/top-of-the-world-just-1920w.jpg': 'destinations/pikes-peak.jpg',
  // About
  'https://lirp.cdn-website.com/312dda6a/dms3rep/multi/opt/websiteimage2_jpeg-1920w.jpg': 'about/hero.jpg',
  'https://lirp.cdn-website.com/312dda6a/dms3rep/multi/opt/pexels-photo-28891275-1920w.png': 'about/pexels-outdoor.png',
  'https://lirp.cdn-website.com/312dda6a/dms3rep/multi/opt/DSC05785-1920w.jpeg': 'about/team-1.jpeg',
  'https://lirp.cdn-website.com/312dda6a/dms3rep/multi/opt/Rich-Valley-Founder-1920w.jpeg': 'about/founder-kit.jpeg',
  'https://lirp.cdn-website.com/312dda6a/dms3rep/multi/opt/IMG_6646-1920w.jpeg': 'about/adventure-action.jpeg',
  'https://lirp.cdn-website.com/312dda6a/dms3rep/multi/opt/IMG_4450-1920w.jpeg': 'about/fishing-2.jpeg',
  'https://lirp.cdn-website.com/312dda6a/dms3rep/multi/opt/IMG_1196-1920w.jpeg': 'about/mountain-view.jpeg',
  'https://lirp.cdn-website.com/312dda6a/dms3rep/multi/opt/image--281-29-1920w.png': 'about/group-photo.png',
}

// Gallery images
const galleryUrls = [
  '_BZP1131-1920w.jpg', '_BZP1795-1920w.jpg', 'IMG_6512+%281%29-1920w.jpeg',
  'IMG_4071-1920w.jpeg', 'family-hike-1920w.jpg', 'IMG_4226-3863d226-1920w.jpeg',
  'kids-fishing-1920w.jpeg', 'IMG_4330-1920w.jpeg', 'IMG_1721-1920w.jpeg',
  'IMG_6142-1920w.jpg', 'IMG_6117-1920w.jpeg', 'RVA-web-photos3-1920w.png',
  'IMG_1627-1920w.jpeg', 'FullSizeRender-1920w.jpeg', 'IMG_0494-1920w.jpeg',
  'DSC02480-1920w.jpeg', 'IMG_6161-1920w.jpeg', 'IMG_4450-fda81333-1920w.jpeg',
  'IMG_8761-1920w.jpeg', 'IMG_6038-1920w.jpeg', 'DSC00536-1920w.jpeg',
  'bike-tour-1920w.jpeg', 'IMG_1092-1920w.jpeg', 'IMG_6683-1920w.jpeg',
  '_BZP1124-1920w.jpg', '_BZP1131+%281%29-1920w.jpg', '_BZP1136-1920w.jpg',
  '_BZP1139-1920w.jpg', '_BZP1144-1920w.jpg', '_BZP1146-1920w.jpg',
  '_BZP1149-1920w.jpg', '_BZP1154-1920w.jpg', '_BZP1159-1920w.jpg',
  '_BZP1162-1920w.jpg', '_BZP1177-1920w.jpg', '_BZP1188-Pano-1920w.jpg',
  '_BZP1189-1920w.jpg', '_BZP1190-1920w.jpg', '_BZP1231-1920w.jpg',
  '_BZP1232-1920w.jpg', '_BZP1256-1920w.jpg', '_BZP1257-1920w.jpg',
  '_BZP1290-1920w.jpg', '_BZP1293-1920w.jpg', '_BZP1297-1920w.jpg',
  '_BZP1308-1920w.jpg', '_BZP1312-1920w.jpg', '_BZP1316-1920w.jpg',
  '_BZP1330-1920w.jpg', '_BZP1339-1920w.jpg', '_BZP1341-1920w.jpg',
  '_BZP1375-1920w.jpg', '_BZP1387-1920w.jpg', '_BZP1390-1920w.jpg',
  '_BZP1393-1920w.jpg', '_BZP1398-1920w.jpg', '_BZP1411-1920w.jpg',
  '_BZP1450-1920w.jpg', '_BZP1456-1920w.jpg', '_BZP1476-1920w.jpg',
  '_BZP1501-1920w.jpg', '_BZP1511-1920w.jpg', '_BZP1520-1920w.jpg',
  '_BZP1523-1920w.jpg', '_BZP1525-1920w.jpg', '_BZP1543-1920w.jpg',
  '_BZP1550-1920w.jpg', '_BZP1553-1920w.jpg', '_BZP1555-1920w.jpg',
  '_BZP1570-1920w.jpg', '_BZP1573-1920w.jpg', '_BZP1599-1920w.jpg',
  '_BZP1611-1920w.jpg', '_BZP1617-1920w.jpg', '_BZP1643-1920w.jpg',
  '_BZP1647-1920w.jpg', '_BZP1666-1920w.jpg', '_BZP1681-1920w.jpg',
  '_BZP1691-1920w.jpg', '_BZP1697-1920w.jpg', '_BZP1717-1920w.jpg',
  '_BZP1740-1920w.jpg', '_BZP1755-1920w.jpg', '_BZP1771-1920w.jpg',
  '_BZP1777-1920w.jpg', '_BZP1792-1920w.jpg',
]

for (const filename of galleryUrls) {
  const url = `https://lirp.cdn-website.com/312dda6a/dms3rep/multi/opt/${filename}`
  const cleanName = decodeURIComponent(filename)
    .replace(/\s+/g, '-')
    .replace(/[+()]/g, '')
    .replace(/-1920w/, '')
    .toLowerCase()
  images[url] = `gallery/${cleanName}`
}

async function downloadImage(url: string, dest: string): Promise<boolean> {
  const fullPath = join(BASE, dest)
  if (existsSync(fullPath)) {
    console.log(`  SKIP ${dest} (exists)`)
    return true
  }
  const dir = dirname(fullPath)
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
  try {
    const res = await fetch(url)
    if (!res.ok) {
      console.error(`  FAIL ${dest}: HTTP ${res.status}`)
      return false
    }
    const buffer = Buffer.from(await res.arrayBuffer())
    writeFileSync(fullPath, buffer)
    console.log(`  OK   ${dest} (${(buffer.length / 1024).toFixed(0)}KB)`)
    return true
  } catch (err) {
    console.error(`  FAIL ${dest}: ${err}`)
    return false
  }
}

async function main() {
  const entries = Object.entries(images)
  console.log(`Downloading ${entries.length} images...\n`)
  let ok = 0, fail = 0
  // Download in batches of 5
  for (let i = 0; i < entries.length; i += 5) {
    const batch = entries.slice(i, i + 5)
    const results = await Promise.all(batch.map(([url, dest]) => downloadImage(url, dest)))
    results.forEach(r => r ? ok++ : fail++)
  }
  console.log(`\nDone: ${ok} downloaded, ${fail} failed out of ${entries.length} total`)
}

main()
