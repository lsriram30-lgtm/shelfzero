const path = require("path");
const sharp = require("sharp");

const assetsDir = path.join(__dirname, "..", "assets");

async function main() {
  await sharp(path.join(assetsDir, "icon-source.svg"))
    .resize(1024, 1024)
    .png()
    .toFile(path.join(assetsDir, "icon.png"));

  await sharp(path.join(assetsDir, "adaptive-icon-source.svg"))
    .resize(1024, 1024)
    .png()
    .toFile(path.join(assetsDir, "adaptive-icon.png"));

  await sharp(path.join(assetsDir, "adaptive-icon-source.svg"))
    .resize(400, 400)
    .png()
    .toFile(path.join(assetsDir, "splash-icon.png"));

  console.log("Generated icon.png, adaptive-icon.png, splash-icon.png");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
