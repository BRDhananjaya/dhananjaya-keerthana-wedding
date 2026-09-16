# Dhananjaya B R weds Keerthana R — Digital Wedding Invitation

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

- Tap-to-open cover over a wedding mandap photo, with deity blessings, animated mandala and
  falling petals
- Emerald green, antique gold and ivory palette, with a faint floral watermark behind the page
- English ⇄ Kannada toggle (choice is remembered on the device)
- Background nadaswaram instrumental with a play/pause toggle, muted by choice and remembered
- Live countdown to the Muhurtham
- Groom's and bride's family details
- Venue card linking to the exact Google Maps pin
- "Add to Calendar" button that downloads an `.ics` with both events
- Native share sheet on mobile, plus a direct WhatsApp share button

## Preview locally

From this folder:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`. (Opening `index.html` directly also works.)

## Editing the wording

All text for both languages lives in `content.js`. Dates, the maps link and the address are in
the `meta` block at the top of the same file — nothing else needs touching.

## Assets and credits

| File                          | What it is                                              |
| ----------------------------- | ------------------------------------------------------- |
| `preview.jpg`                 | 1200×630 card shown when the link is shared             |
| `images/cover-bg.jpg`         | Mandap photo behind the cover and the Muhurtham card    |
| `images/floral-watermark.jpg` | Faint tiled floral pattern behind the page              |
| `music/nadaswaram-mangala-vadyam.mp3` | Background music                                |

The three images were AI-generated for this invitation, so they carry no licence restrictions.

### Music credit

The background music is a 1:55 excerpt of
**["Thakil & Nadaswaram during temple Deeparadhana"](https://commons.wikimedia.org/wiki/File:Thakil_%26_Nadaswaram_during_temple_Deeparadhana.ogg)**
by **Vis M**, from Wikimedia Commons, licensed under
**[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)**.

The nadaswaram with thavil accompaniment is the traditional *mangala vadyam* ensemble played at
South Indian weddings and temple rituals. The excerpt was trimmed from the calmer middle of the
recording, high-pass filtered to remove live-recording rumble, loudness-normalised to −18 LUFS
with peaks pulled back to −3.4 dB, and given fades at both ends so it loops without a jolt.

**This licence requires attribution**, so the credit appears in two places and both must be kept
if the track stays: this README, and a small line in the page footer (wired through `content.js`
as `musicCredit`, in both languages). To swap in a different track, replace the file and update
the `<audio>` `src` in `index.html` — and update or remove the credit to match.

### Changing the colours

The whole palette is defined once, in the `:root` block at the top of `styles.css`. Changing
`--green`, `--green-soft`, `--green-deep` and `--gold` recolours the entire page.

## Live link

**https://brdhananjaya.github.io/dhananjaya-keerthana-wedding/**

Hosted on GitHub Pages from the `main` branch. To publish a change, commit and push — the site
rebuilds itself in a minute or two:

```bash
git add .
git commit -m "Update wording"
git push
```

Paste the link into WhatsApp and the title and description preview come from the `og:` meta tags
in `index.html`.

### Note on the corporate network

This machine reaches GitHub through a proxy, which is already saved for this repo
(`git config --local http.proxy`). If a push ever fails to connect from a different network,
clear it with `git config --local --unset http.proxy` and the same for `https.proxy`.

## Optional polish

- **Your own photos:** swap `images/cover-bg.jpg` for a real photo of the two of you, keeping it
  dark enough that the gold text on the cover stays readable.
- **RSVP:** a Google Form link in the actions row is the simplest way to collect replies.
