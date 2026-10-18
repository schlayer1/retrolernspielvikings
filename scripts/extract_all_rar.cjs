const fs = require('fs');
const path = require('path');
const { createExtractorFromFile } = require('node-unrar-js');

async function extractAll() {
  const assetsDir = path.resolve('Assets');
  const extractedBase = path.resolve('Assets/extracted');
  fs.mkdirSync(extractedBase, { recursive: true });

  const files = fs.readdirSync(assetsDir);
  const rarFiles = files.filter(f => f.toLowerCase().endsWith('.rar'));

  console.log(`Found ${rarFiles.length} RAR archives to extract.`);

  for (const rar of rarFiles) {
    const archiveName = path.basename(rar, path.extname(rar)).trim();
    const targetDir = path.join(extractedBase, archiveName);
    fs.mkdirSync(targetDir, { recursive: true });

    const archivePath = path.join(assetsDir, rar);
    console.log(`\n📦 Extracting "${rar}" -> "${archiveName}"...`);

    try {
      const extractor = await createExtractorFromFile({
        filepath: archivePath,
        targetPath: targetDir,
      });

      const extracted = extractor.extract();
      let count = 0;
      for (const f of extracted.files) {
        count++;
      }
      console.log(`  ✅ Extracted ${count} items from ${rar}`);
    } catch (err) {
      console.error(`  ❌ Error extracting ${rar}:`, err.message);
    }
  }

  // Also check if Celtic Druid Village directory needs to be mirrored or symlinked
  const celticSrc = path.join(assetsDir, 'Celtic Druid Village ');
  const celticDst = path.join(extractedBase, 'Celtic Druid Village');
  if (fs.existsSync(celticSrc) && !fs.existsSync(celticDst)) {
    console.log(`\n📋 Copying Celtic Druid Village folder to extracted...`);
    fs.cpSync(celticSrc, celticDst, { recursive: true });
    console.log(`  ✅ Copied Celtic Druid Village`);
  }

  console.log('\n🎉 All extractions complete!');
}

extractAll().catch(err => {
  console.error('Fatal error in extractAll:', err);
  process.exit(1);
});
