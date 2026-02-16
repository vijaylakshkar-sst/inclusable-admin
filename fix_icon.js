const fs = require('fs');
const path = require('path');

const svgPath = path.join('d:\\lokesh\\inclusable-admin\\src\\app', 'icon.svg');
const pngPath = path.join('d:\\lokesh\\inclusable-admin\\src\\app', 'icon.png');

try {
    if (!fs.existsSync(svgPath)) {
        console.log('icon.svg does not exist, skipping.');
        process.exit(0);
    }
    const svgContent = fs.readFileSync(svgPath, 'utf8');
    const match = svgContent.match(/xlink:href="data:image\/png;base64,([^"]+)"/);

    if (match && match[1]) {
        const base64Data = match[1];
        const buffer = Buffer.from(base64Data, 'base64');
        fs.writeFileSync(pngPath, buffer);
        console.log('Successfully created icon.png');

        fs.unlinkSync(svgPath);
        console.log('Deleted icon.svg');
    } else {
        console.error('Could not find base64 PNG data in icon.svg');
        process.exit(1);
    }
} catch (error) {
    console.error('Error processing icon:', error);
    process.exit(1);
}
