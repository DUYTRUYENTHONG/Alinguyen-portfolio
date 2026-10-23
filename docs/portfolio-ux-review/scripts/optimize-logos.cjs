// Encode approved image-tool cutouts for small UI slots; retain generated alpha.
// Usage: node optimize-logos.cjs growth.png stos.png chokenh.png
const path = require('node:path');
const sharp = require('sharp');
const root = path.resolve(__dirname, '../../..');
const names = ['duytruyenthong-logo-transparent.webp','stos-symbol-transparent.webp','cho-kenh-logo-transparent.webp'];
if (process.argv.length !== 5) throw new Error('Provide the three image-tool output paths.');
Promise.all(names.map(async (name,i)=>{
  const target = path.join(root,'public',name);
  await sharp(process.argv[i+2]).trim().resize(192,192,{fit:'inside'}).webp({quality:90,alphaQuality:100}).toFile(target);
  console.log(JSON.stringify({name,...await sharp(target).metadata()}));
})).catch(error=>{console.error(error.message);process.exitCode=1;});
