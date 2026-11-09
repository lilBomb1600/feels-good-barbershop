# Feel Goods remaster: direction

The first version was a plain vintage-Americana page: Anton type, an SVG pole, and no photos. The remaster raises it to the HARD PART bar (trade signature loader, real 3D hero, sections that flow, cursor-reactive lists), but the world comes from Feel Goods itself, not from HARD PART.

## The world: black, white and one red rose

The shop already has a look, and it shows in all 119 owner photos:

- **The black-and-white checkered floor.** It is in almost every shot.
- **Red rose-print capes.** They are on every chair, along with a rose in the graffiti "FEEL GOODS" mural and roses in the flyer logo.
- **A red, white and blue barber pole.**
- **Johnny's own striped capes.** They carry a red "Johnny B" signature.

So the site is ink and paper with a single color: rose red. Every photo gets the same **rose grade**:

- everything goes monochrome in the site's ink-to-paper tones;
- only the reds of the rose capes, the Mexican-flag capes and the dyed hair keep their color.

The grade turns cluttered phone shots into one consistent editorial set, and the roses on the capes carry the brand color through the photos. The navy shows up only in the pole stripes.

- **Type:**
  - **Big Shoulders** (900) is the giant sign-painter display voice: FEEL, the price numbers, 4.6.
  - **Mr Dafoe**, a brush script, echoes the script "Feel Goods" on their own flyer. It's used only for the word "Goods" and the footer sign-off.
  - **Archivo** carries headings and body. The headings pair a regular word with a heavy word ("Prices, **plain and simple.**").
- **Light vs dark.** The use scene is a parent booking a kid's cut on a phone in the evening, or a regular checking hours, so the page runs dark. It alternates with paper sheets the way the floor alternates tiles.

## Signature 1: the loader, "Cape off"

**What happens:**
- The screen opens covered by their real rose cape. It is a crop of fg-085, cape-graded so the roses are deep red on black fabric.
- In the middle, the name sits over a progress bar made of the moving pole stripe (the existing seam-free `PoleStripes` SVG).
- Then the cape gets **whipped off** the way a barber pulls it at the end of a cut. It lifts in 14 vertical strips with a staggered, wave-shaped delay, so the hem ripples like fabric while the shop is revealed underneath.
- It plays once per session (sessionStorage, plus an inline head script so a repeat visit never flashes it). It is skippable with a Skip button or the Esc key.
- With reduced motion it doesn't play at all. Without JS it is hidden by a noscript style.

**Why not the suggested "clipper shaves a star" loader:** it keeps HARD PART's structure (clipper, hair texture, guard counter) and only swaps the shape, so it would read as a copy. The cape reveal comes from this shop's own photos and from the ritual every client knows: the cape comes off and you see the cut. The shaved star still appears as the site's mark in the nav and on the map pin, drawn as a double line like a real shaved design.

## Signature 2: the 3D hero pole

The hero is a real three.js / React Three Fiber barber pole.

**The pole:**
- a glass sleeve over a spinning red/cream/navy helix (a seam-free canvas texture);
- chrome caps and a finial, lit by a procedural RoomEnvironment (no HDRI download);
- it stands on the shop's checkered floor, with a mirrored reflection and a soft contact shadow, and fades into fog.

**How it moves:**
- The cursor is a lamp: a spotlight follows the pointer across the floor and the glass.
- Scroll spins the stripe faster and lifts the camera as the paper price sheet slides over the pinned hero.

**Type around it:**
- Giant "FEEL" sits behind the pole, so the pole occludes it.
- "Goods" in the red brush script crosses in front.
- A "Book with Johnny" pill links to Booksy, and a live open/closed line sits in the corner.

**Performance:**
- The 3D bundle loads only on the client (`next/dynamic`, `ssr:false`), and it renders only while the hero is on screen (`frameloop="never"` off screen).
- A static PNG of the same pole is used for reduced motion, Save-Data, low-memory or low-core devices, and missing WebGL.

## Backgrounds (BACKGROUNDS-22)

1. **The checkered floor** (their real floor):
   - the 3D ground in the hero;
   - the seams between sections: a band of tiles at each light/dark change, which flip in a stagger as you scroll through it.
2. **Halftone** (#8, the barber/print fit), drawn at runtime on a canvas from a tiny grayscale source:
   - a red dot-screen rose behind the reviews;
   - a cream dot screen of the shop interior (mural, chairs, checkered floor, fg-016) behind Visit.
3. **Grain** over the dark sections, as a secondary layer.

## Section flow

1. **Loader**: Cape off.
2. **Hero** (ink, pinned): 3D pole, FEEL / Goods, copy, Book with Johnny, See prices, 4.6 on Booksy, live open line.
3. **Prices** (paper sheet that slides over the hero; its top edge is a row of checker tiles):
   - "Prices, plain and simple."
   - A numbered board: #01 Adults $50, #02 Seniors $40, #03 Kids $40, #04 Hot towel facial / shave $30.
   - On desktop, hovering a row makes its graded photo follow the cursor. On phones each row has its photo inline.
4. **Lookbook** (ink, checker seam flips in): "Fresh out the chair."
   - Filter chips: All / Fades / Designs / Kids / Curls / Beards.
   - Four tiles flip to a second angle of the same client on hover, focus or tap.
5. **Reviews** (paper, halftone rose, checker seam):
   - a giant 4.6 and "125 reviews on Booksy";
   - a carousel of the six real Booksy quotes (prev/next, swipe, counter).
6. **Visit** (ink, shop halftone, checker seam):
   - a stylized map with a star pin (abstract streets, no invented landmarks);
   - the address, phone and directions;
   - the hours, with today highlighted and a live line computed in America/Los_Angeles ("Open now, closes 7:30 PM", "On lunch break, back at 1:30 PM", "Closed, opens Monday 11:00 AM");
   - amenities.
7. **Book** (on the rose cape again, closing the loop with the loader):
   - "Ready when you are." with a big Book on Booksy and the phone;
   - the barber in an oval mirror frame.
8. **Footer**: links, socials, and an honest concept note. The PreviewMark watermark stays until `NEXT_PUBLIC_LICENSED=true`.

**Language:** EN / ES toggle in the nav. Both languages are server-rendered and switched by `html[data-lang]` before paint, so there's no flash. The Spanish is natural, for Pittsburg's Latino families. Review quotes stay in their original English, with a note that says so.

## Photos used (all from assets-inbox/maps, rose-graded, EXIF stripped, WebP)

Back and side views are preferred. No child's face is the hero, and nothing with screenshots, flyers or text overlays is used.

| Use | File | Why |
|---|---|---|
| Price: Adults | fg-024 | Back of an adult taper in front of the FEEL GOODS mural and checker floor |
| Price: Seniors | fg-007 | An empty chair with Johnny's striped cape at his station (no person, so there's no age claim) |
| Price: Kids | fg-073 | A kid's skin fade, head down, face mostly hidden |
| Price: Hot towel | fg-031 | A client reclined for a shave, on a rose cape |
| Fades | fg-084, fg-059, fg-088, fg-067 | Back and side tapers. fg-084 has the mural, fg-067 has the real pole |
| Designs | fg-108 (star), fg-028 (zigzag star), fg-078 + fg-009 (greek key, back then side, same client), fg-117 + fg-032 (freestyle lines, back then side, same client), fg-103 (lines) | Their design work is the strongest thing in the set |
| Kids | fg-038, fg-086, plus the two star designs | Side and back views only |
| Curls | fg-043 + fg-042 (same client, two angles), fg-055 + fg-050 (same client, two angles), fg-056, fg-072 | Curly tops with tapers, mostly from behind |
| Beards | fg-114 (cropped above the "After" overlay and phone UI), fg-017, fg-000 | Beard work, side views |
| Barber | fg-025, cropped to head and shoulders | A posed shot behind his own chair with the pole behind him. Cropped above the shirt print, which has a profanity |
| Cape texture | fg-085 | The clearest full rose on a cape, used for the loader and the closing CTA |
| Halftones | fg-085 (rose), fg-016 (shop interior with the mural) | Background dot screens |

**Skipped:**
- fg-102, the before/after collage. It's 642 px per half and has a "7:50 PM" timestamp and Before/After script baked in.
- Flyers and screenshots (fg-095 to fg-098, fg-104, fg-105, fg-107, fg-110, fg-112, fg-115, fg-092, fg-106, fg-109).
- Close-up kid faces.
- The outdoor shots, where carports and cars clutter the frame, except the two curl angles (fg-055/fg-050) and the design pair (fg-032).

**Pipeline:** `scripts/photos.py` (crop, rose grade, EXIF strip, never upscale) and `scripts/halftone.py`.
- Tiles export at 640/1280, capped at the crop's real width. They never render wider than about 600 CSS px, so 1920/2560 would be dead weight.
- The full-bleed textures (cape, shop) export at 640/1280/1920/2560, also capped.
