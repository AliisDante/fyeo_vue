// redactImage.js

import Jimp from 'jimp';

export default async function redactImage(imageFile, words) {
  const image = await Jimp.read(imageFile);

  // Font for measuring text
  const font = await Jimp.loadFont(Jimp.FONT_SANS_16_BLACK);

  words.forEach(word => {
    // Measure word width 
    const textWidth = Jimp.measureText(font, word);
    
    // Search text layer for word
    const text = image.bitmap.data;
    const regex = new RegExp(word, 'gi');
    let match;
    while ((match = regex.exec(text)) !== null) {
      // Calculate position
      const pos = match.index;
      const x = Jimp.measureText(font, text.substring(0, pos));
      const y = 10; // offset from top

      // Create overlay
      const overlay = new Jimp(textWidth, 24);
      overlay.bitmap.fill(0, 0, 0);

      // Redact image
      image.composite(overlay, x, y);
    }
  });

  // Async get buffer
  return new Promise((resolve, reject) => {
    image.getBuffer(Jimp.MIME_PNG, (err, buffer) => {
      if (err) {
        reject(err);
      } else {
        resolve(buffer);
      }
    });
  });
}
