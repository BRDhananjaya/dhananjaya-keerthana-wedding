# Keerthana R weds Dhananjaya B R — Digital Wedding Invitation

A mobile-first, single-page digital invitation built with plain HTML, CSS and JavaScript.
No build step, no dependencies — open `index.html` and it works.

## Events

| Event      | Date                        | Time                   |
| ---------- | --------------------------- | ---------------------- |
| Reception  | Tuesday, 13 October 2026    | 7:30 pm onwards        |
| Muhurtham  | Wednesday, 14 October 2026  | 9:00 am – 9:30 am (Vrushika Lagna) |

**Venue:** Brundavana Convention Hall, Tulasi Nagar, Vishwaneedam Post, Magadi Main Road,
Kempegowdanagar, Byadarahalli, Bengaluru – 560 091

## What's in it

- Tap-to-open cover with deity blessings, animated mandala and falling petals
- English ⇄ Kannada toggle (choice is remembered on the device)
- Live countdown to the Muhurtham
- Bride's and groom's family details
- Venue card with a Google Maps link
- "Add to Calendar" button that downloads an `.ics` with both events
- Native share sheet on mobile, plus a direct WhatsApp share button

## Preview locally

From this folder:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`. (Opening `index.html` directly also works.)

## Editing the wording

All text for both languages lives in `content.js`. Dates and the maps search string are in the
`meta` block at the top of the same file — nothing else needs touching.

## Publishing so friends can open the link

Any static host works. Two easy options:

**Netlify Drop** — go to https://app.netlify.com/drop and drag this folder in. You get a live
link in seconds, and can rename it to something like `keerthana-dhananjaya.netlify.app`.

**GitHub Pages** — push this folder to a GitHub repo, then in the repo go to
Settings → Pages → Source: `main` branch, root folder. The site appears at
`https://<username>.github.io/<repo>/`.

Once live, paste the link into WhatsApp — the title and description preview come from the
`og:` meta tags in `index.html`.

## Optional polish

- **Link preview image:** add a photo named `preview.jpg` (1200×630) to this folder and add
  `<meta property="og:image" content="preview.jpg" />` inside `<head>`, so WhatsApp shows a picture.
- **Background music:** drop an audio file in the folder and wire up a small play/pause toggle.
