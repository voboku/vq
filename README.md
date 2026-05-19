# otoge

An experimental browser-based image-to-sound instrument.

Drop an image into the scanner area, choose a scan mode, and play the image as a spatial score. The instrument uses the Web Audio API and runs entirely in the browser.

## Files

- `index.html` - app markup
- `styles.css` - visual design
- `app.js` - image analysis, scan playback, synthesis, sampler, and spatial audio

## Use Locally

Open `index.html` in a browser.

For the most stable audio/file behavior, serve the folder with a local static server:

```sh
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Deploy

This is a static site. Upload the contents of this folder to:

- GitHub Pages
- Netlify
- Vercel
- Cloudflare Pages

No build step is required.

## Notes

The app does not upload images or audio samples to a server. Image and sample processing happens locally in the browser.
