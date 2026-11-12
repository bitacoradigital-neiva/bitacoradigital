---
name: Bitácora Digital
description: Tecnología y diseño. Sin complicaciones. A Swiss motion poster in brand blue.
colors:
  blue: "#0b57f0"
  blue-deep: "#0843c4"
  on-blue: "#ffffff"
  on-blue-2: "#dce6ff"
  ink: "#0a0e1a"
  ink-2: "#4b5263"
  ink-soft: "#b3bacb"
  paper: "#ffffff"
  mist: "#eef1f6"
  line: "#d6dce7"
  line-dark: "rgba(255, 255, 255, 0.18)"
  wa: "#25d366"
  wa-ink: "#05290f"
typography:
  display:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(2.75rem, 0.9rem + 6.4vw, 6rem)"
    fontWeight: 760
    lineHeight: 0.95
    letterSpacing: "-0.04em"
    fontVariation: "'wdth' 106"
  headline:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(2.25rem, 1.2rem + 4.2vw, 5rem)"
    fontWeight: 760
    lineHeight: 0.95
    letterSpacing: "-0.04em"
    fontVariation: "'wdth' 106"
  numeral:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(3rem, 1rem + 6.6vw, 6rem)"
    fontWeight: 800
    lineHeight: 0.9
    letterSpacing: "-0.04em"
    fontFeature: "'tnum'"
    fontVariation: "'wdth' 118"
  title:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(1.5rem, 1.2rem + 1.2vw, 2.25rem)"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.03em"
    fontVariation: "'wdth' 104"
  lead:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(1.125rem, 1rem + 0.5vw, 1.4rem)"
    fontWeight: 400
    lineHeight: 1.4
  body:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.5
    fontFeature: "'lnum'"
  label:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 600
    lineHeight: 1.45
  caption:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 600
    lineHeight: 1.4
rounded:
  r: "6px"
  inner: "4px"
  pixel: "3px"
  round: "50%"
spacing:
  gutter: "clamp(18px, 4.5vw, 56px)"
  wrap: "1280px"
  bar: "60px"
  section: "clamp(72px, 10vw, 140px)"
  block: "clamp(48px, 7vw, 96px)"
  stack: "clamp(22px, 3vw, 36px)"
components:
  button-primary:
    backgroundColor: "{colors.blue}"
    textColor: "{colors.on-blue}"
    rounded: "{rounded.r}"
    padding: "0 24px"
    height: "54px"
  button-primary-hover:
    backgroundColor: "{colors.blue-deep}"
  button-white:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.blue}"
    rounded: "{rounded.r}"
    padding: "0 24px"
    height: "54px"
  button-white-hover:
    backgroundColor: "{colors.on-blue-2}"
  button-whatsapp:
    backgroundColor: "{colors.wa}"
    textColor: "{colors.wa-ink}"
    rounded: "{rounded.r}"
    padding: "0 24px"
    height: "54px"
  button-whatsapp-disabled:
    backgroundColor: "transparent"
    textColor: "{colors.on-blue-2}"
    rounded: "{rounded.r}"
  nav-bar:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    height: "{spacing.bar}"
  quote-card:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.r}"
    padding: "12px 14px 14px"
  quote-card-selected:
    backgroundColor: "#f2f6ff"
    textColor: "{colors.ink}"
    rounded: "{rounded.r}"
  quote-summary:
    backgroundColor: "{colors.blue}"
    textColor: "{colors.on-blue}"
    rounded: "{rounded.r}"
    padding: "clamp(22px, 3vw, 32px)"
  segmented-active:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.inner}"
    height: "40px"
  poster:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-blue}"
    height: "clamp(540px, 88svh, 940px)"
---

# Design System: Bitácora Digital

## Overview

**Creative North Star: "Cartel azul suizo"**

The site is a Swiss International-Style motion poster. Price and process are set in giant, tight, flush-left grotesk on a strict grid, and the brand blue owns whole fields rather than tinting accents. Sections alternate between three grounds: blue field, white paper, and near-black ink. Each change of ground is a hard cut, never a fade. Type and numerals are the image. The only ornament is the logo's own vocabulary: the cursor arrow and the trailing pixel squares.

Density is poster-like: few elements, each very large, separated by hairline and heavy column rules instead of cards. Motion is typographic and scroll-bound. Words rise out of masks, prices count up, the services marquee slides with the scroll, and the process row pins and travels sideways on wide screens. Every effect is tiered by device and switched off when a phone starts to struggle, because most visitors arrive on mid-range phones.

The world refuses the category default for small tech providers: a light landing page with a centered hero, glass cards, gradient blobs and stock-photo tiles.

**Key Characteristics:**
- Brand blue as a committed field covering roughly 40% of the page, not as an accent sprinkle.
- One variable grotesk (Archivo) with a width axis: widened for numerals, near-normal for headings.
- Rules instead of boxes: 2px white or ink head rules, 1px hairlines between rows and columns.
- Small radius everywhere (6px), so blocks read as rectangles.
- The logo's cursor arrow is the page's guide; its pixel squares are the only decoration.
- Motion is typographic, scroll-linked, tiered by device, and fully optional.

## Colors

A three-ground palette: one saturated brand blue, pure white paper and near-black ink, with WhatsApp green kept strictly for the contact action.

### Primary
- **Bitácora Blue** (blue): the field color for the hero, the process section, the web-service detail block, the quote summary and the closing poster. It is also the primary button fill on paper, the focus ring, the selection highlight, the scroll-progress bar, the checked checkbox and the route guide on paper.
- **Deep Field Blue** (blue-deep): hover for blue buttons and the fill of the hero pixel squares, so the ornament sits one step into the field instead of on top of it.

### Secondary
- **WhatsApp Green** (wa) with **Forest Ink** (wa-ink) for its label: used only for actions that open WhatsApp (hero, menu sheet, quote summary, closing, floating button). It is never decorative and never used on any other button.

### Neutral
- **Paper** (paper): the light ground, the nav bar and the quote cards.
- **Night Ink** (ink): body text on paper, the services marquee band, the coverage section, the footer, the poster base under video, the active segmented control and the thumbnail category tag.
- **Slate Ink** (ink-2): secondary text on paper (leads marked soft, FAQ answers, ETAs, inactive nav links).
- **Pale Slate** (ink-soft): secondary text on ink grounds (coverage labels, footer links).
- **Ice Blue** (on-blue-2): secondary text on blue (leads, "desde" labels, summary line costs) and the white-button hover.
- **Mist** (mist): hover wash for nav links and dialog close, and the scrollbar track.
- **Hairline** (line) and **Hairline on Dark** (line-dark): 1px row dividers on paper and on blue or ink grounds respectively.

### Named Rules
**The Committed Field Rule.** Blue is applied as a full-bleed section ground or as a solid block, never as a tint, a gradient or a glow. A screen in this world is blue, white or ink; it is never a mixture of them.

**The Green Means WhatsApp Rule.** WhatsApp green marks the single act of writing on WhatsApp. Any other action uses blue, white or an outline.

## Typography

**Display Font:** Archivo variable (self-hosted woff2, weight 100–900, width 62–125%), with Helvetica Neue and Arial as fallbacks
**Body Font:** the same Archivo
**Label/Mono Font:** none; labels are Archivo at weight 550–650

**Character:** one grotesk does every job. The width axis carries the hierarchy: headings sit at 104–108%, price numerals widen to 118%, step numerals to 122% and the marquee to the full 125%. Weight stays heavy (700–800) and tracking stays tight (−0.04em) at every large size.

### Hierarchy
- **Display** (760, clamp 2.75–6rem, 0.95, −0.04em, width 106%; the hero title widens to 108%): the hero title, the service poster titles and the closing "¿Hablamos?" (800). Set flush-left with balanced wrapping. The hero's second line drops to Ice Blue.
- **Headline** (760, clamp 2.25–5rem, 0.95, −0.04em, width 106%): section titles. They always end with a period, like a poster statement.
- **Numeral** (800, clamp 3–6rem, 0.9, −0.04em, width 118%, tabular figures): "desde" prices on posters and in the hero table (the table caps at 4rem), the quote total (width 108%) and step numerals (width 122%, line-height 0.8).
- **Title** (700, clamp 1.5–2.25rem, 1.05, −0.03em, width 104%): step titles, coverage fact values and the dialog heading.
- **Lead** (400, clamp 1.125–1.4rem, 1.4, max 34ch): the one plain sentence under each heading.
- **Body** (400, 1.0625rem, 1.5, lining figures): running text. FAQ answers cap at 62ch.
- **Label / Caption** (550–650, 0.9375rem and 0.8125rem): nav links, buttons, "desde" markers, ETAs and the legal note. Sentence case, no wide tracking.

### Named Rules
**The Width Axis Rule.** Hierarchy comes from size and width, not from added typefaces or colors. The wider the setting, the more a number matters: prices and step numbers are always the widest type on their ground.

**The Flush-Left Rule.** All display type is left-aligned on the grid. Nothing is centered.

## Layout

The grid is a 12-column field inside a 1280px wrap with a fluid gutter (18–56px). Splits are expressed as column fractions: 6/6 for the hero row and coverage, 5/7 for service details, 7/4 for the quote and its summary, 4/7 for the FAQ with a sticky title, and 7/5 for the closing.

The first viewport is a full-height blue field (100svh). The display title spans about 10 of 12 columns, followed by one lead line and two buttons, and the three-column price table sits on the bottom edge. Service posters run full-bleed (clamp 540px, 88svh, 940px) with copy anchored to the bottom-left. Sections breathe on a 72–140px vertical rhythm; service detail blocks use 48–96px.

Breakpoints, as built:
- 600px: hero title lines run inline below this width.
- 700px: steps move to two columns and the quote ledger to three columns.
- 880px: the nav links collapse into the menu sheet below this width.
- 900px: multi-column splits begin, the hero price table becomes three ruled columns, and the hero pixel squares appear (also hidden when the viewport is under 820px tall).
- 1000px: the quote moves to the 7/4 split with a sticky summary, and the mobile quote bar is hidden.
- 1100px: the four steps sit in one row, and on capable devices the row becomes a pinned horizontal rail.
- 1500px: a fixed side index appears.

The phone layout is the primary one. Everything stacks, the summary stops being sticky, and a fixed ink quote bar carries the running total.

## Elevation & Depth

The system is flat. Depth comes from changes of ground (blue, paper, ink), the darkened video under posters, and rules. Content surfaces such as quote cards, the summary, steps and facts carry no shadow; cards use an inset 1px Hairline stroke instead. Shadows exist only on layers that genuinely float above the page, and they are always neutral ink, never colored.

### Shadow Vocabulary
- **Bar hairline** (`box-shadow: 0 1px 0 #d6dce7`): the fixed nav bar's bottom edge.
- **Sheet drop** (`box-shadow: 0 1px 0 #d6dce7, 0 24px 40px -24px rgba(10, 14, 26, 0.35)`): the mobile menu sheet.
- **Floating bar** (`box-shadow: 0 16px 32px -12px rgba(0, 0, 0, 0.5)`): the mobile quote bar.
- **Dialog** (`box-shadow: 0 30px 60px -20px rgba(0, 0, 0, 0.5)`): the legal dialog, over an ink backdrop at 60%.
- **Checkbox on photo** (`box-shadow: 0 0 0 2px #fff, 0 2px 8px rgba(0, 0, 0, 0.35)`): keeps the card checkbox legible over thumbnail images.

### Named Rules
**The Float-Only Shadow Rule.** A shadow means "this layer floats over the page" (sheet, bar, dialog, floating button). Content surfaces stay flat and use strokes and rules.

## Shapes

The system is rectangular. Buttons, cards, the summary, the quote bar and the dialog share one small radius (6px). Inner controls use 4px (segmented buttons, checkboxes), the hero pixel squares use 3px, and the marquee squares and service-fact bullets are near-square. The only circles are the floating WhatsApp button and the tap ring. Structure is drawn with rules: a 2px white or ink head rule opens each list or table, 1px hairlines separate rows, and columns are divided by 1px rules at 45% white with a 2px white first rule. Posters clip their video to the full rectangle; on capable wide screens the poster unfolds from an inset rectangle (6px corners) to full bleed.

## Components

### Buttons
Rectangular, heavy and quiet, with no decorative shadows.
- **Shape:** small radius (6px), 54px tall, 24px side padding, weight 650, width 104%, 20px stroke icon.
- **Primary (on paper):** blue fill, white label; hover Deep Field Blue.
- **White (on blue or ink):** paper fill, blue label; hover Ice Blue.
- **WhatsApp:** green fill, Forest Ink label, official WhatsApp glyph.
- **Outline:** a 2px inset stroke in the current color that fills on hover.
- **Press:** scale 0.97 over 140ms. Hover applies only on devices with hover. Focus is a 3px blue ring offset 3px, white on blue and ink grounds.
- **Disabled WhatsApp (quote summary):** transparent fill, Ice Blue label, 2px inset white stroke at 60%, not-allowed cursor, with a one-line white reason below it ("Marca la casilla de términos…"). It never greys out the green; the green appears only when sending is possible.

### Navigation
- A fixed 60px paper bar with a hairline bottom edge, holding the logo and name, nav links in Slate Ink (hover: Ink on Mist), and a compact blue "Cotizar" button (40px).
- A 3px blue scroll-progress bar runs along its bottom edge.
- Below 880px the links collapse into a full-width paper sheet with large 1.5rem titles on hairlines and a WhatsApp button.

### Poster (signature)
Each service, and the closing section, is a moving poster.
- A full-bleed muted looping video (with a poster image) covers an ink base. Videos play only while on screen and never under reduced motion or data saving.
- A flat shade sits over the video: ink at 52% by default, ink at 50% for light footage, or Bitácora Blue at 78% for a blue poster. The shade is never a gradient.
- Copy sits bottom-left: the route guide, a display title (max 15ch), then a price line on a 2px white head rule. The price line carries "desde" in Ice Blue, a wide numeral price, and the delivery time.
- Below each poster sits a detail block on paper or blue: a soft lead, a button, and a fact list on rules with small square bullets (blue on paper, white on blue).

### Hero price table
- Three service columns on the hero's bottom edge. On wide screens they are separated by vertical rules (2px white on the first, 45% white on the rest); on phones they become stacked rows on hairlines under a 2px white rule.
- Each column holds the service name (title weight), "desde" in caption Ice Blue, and a numeral price (width 118%, tabular). Each column links to its poster, and on hover the name gets a 2px underline.

### Process steps
- Four steps in a blue field, without cards. Each step is a giant numeral (800, width 122%), a title and Ice Blue copy (max 34ch).
- On phones each step opens with a 2px white top rule. From 700px the steps are columns separated by vertical rules, with a 2px white first rule.

### Quote cards and checkbox
- **Card:** paper, 6px corners, 1px inset Hairline stroke, a 16:10 thumbnail with a small ink category tag in its corner, then name, price (tabular) and ETA. Hover darkens the stroke to Slate Ink and scales the image to 1.05. Press scales the card to 0.98.
- **Selected:** a pale blue wash (#f2f6ff) and a 3px inset blue stroke; the description expands with a grid-rows transition.
- **Checkbox:** 26px, 4px corners. Unchecked it shows a 2px inset stroke on white; checked it turns blue with a white check mark. Press scales it to 0.88. On thumbnails it gains a white halo and a soft shadow so it stays legible. On the blue summary it inverts: a white stroke, and when checked a white fill with a blue check.
- **Summary:** a blue panel (sticky from 1000px) with line items on dark hairlines, a giant total, the terms checkbox, and the WhatsApp button or its disabled state. When the total changes it re-enters with a 280ms rise.
- **Segmented control:** for currency; a 1px inset Hairline track, with the active option in ink with white text.

### Route guide
The logo's cursor arrow guides the eye down to each section title. A 3px vertical line (blue on paper, white on blue or ink) draws downward while the cursor descends to land at the heading, scrubbed to scroll. In the quote section the same cursor appears once as a tap guide: it slides to the first checkbox, "taps" with a ring pulse, and leaves. It is skipped if the visitor has already selected something.

### Motion grammar
- **Library:** GSAP 3.13 with ScrollTrigger and SplitText; Lenis smooth scroll (lerp 0.16) only on fine pointers.
- **Easing:** expo.out for entrances (CSS `cubic-bezier(0.16, 1, 0.3, 1)`); linear for anything scrubbed.
- **Word mask reveal:** headings split into words that rise from yPercent 110 inside masks (0.9–1s, stagger 0.07–0.08), triggered once.
- **Hero load:** title word reveal, pixel squares scale in (stagger 0.07), and the three prices count up from 0 over 1.2s. On scroll the pixel squares fall behind by 30%.
- **Poster scrub:** the video scales from 1.18 to 1 and drifts −4% to 4% while the poster crosses the screen. On the alta tier at 900px and up, the poster also unclips from an inset rectangle.
- **Marquee scrub:** the giant services band (800, width 125%, alternating solid and outlined words, blue squares between them) slides −28% on scroll.
- **Pinned process rail:** from 1100px, the step row pins and travels horizontally with the scroll.
- **Cards:** the quote cards cascade in (y 32, stagger 0.05).
- **Fallback:** without GSAP or on the baja tier, elements marked for reveal fade and rise 24px over 700ms.

### Device tiers and watchdog
- **alta:** every effect. Detected as Apple devices, or other devices with more than 4 cores and more than 4 GB.
- **media:** everything except the poster unclip. Devices with 4 cores or 4 GB or fewer.
- **baja:** only simple fades, no Lenis. Triggered by reduced motion, Save-Data, 2G, or 2 cores / 2 GB or fewer.
- **Watchdog:** while scrolling past the hero, frames are sampled in batches of 90. A batch is slow when more than 14 frames exceed 34ms or the average frame exceeds 30ms. After three slow batches in a row, the page switches to baja: scroll effects jump to their end state, the rail unpins, and the tap guide is removed.

### Reduced motion
`prefers-reduced-motion: reduce` forces the baja tier. It also disables smooth scrolling and collapses all transitions and animations to 1ms, and videos stay on their poster image. Content is fully visible without any motion.

## Do's and Don'ts

### Do:
- **Do** give blue whole sections or solid blocks; keep the rhythm of blue, paper and ink grounds with hard cuts between them.
- **Do** set display type flush-left, heavy (760–800) and tight (−0.04em), and widen numerals (118–125%) so prices and step numbers lead.
- **Do** structure lists, tables and steps with a 2px head rule and 1px hairlines instead of cards.
- **Do** keep the 6px radius on every block and 4px on inner controls.
- **Do** use the logo's cursor arrow and pixel squares as the only ornament and the only guide.
- **Do** tier every motion effect by device (alta, media, baja), keep it transform-only, and let the watchdog switch it off.
- **Do** show the disabled WhatsApp action as an outline with a plain reason, never as a greyed green button.

### Don't:
- **Don't** add eyebrows or kicker labels above headings; a heading is a single poster statement ending in a period.
- **Don't** use gradients, including on poster shades; shades are a flat ink or blue fill.
- **Don't** use glass, backdrop blur or translucent frosted panels.
- **Don't** use colored glow shadows; shadows are neutral ink and only on floating layers.
- **Don't** center display type or hero compositions.
- **Don't** use WhatsApp green for anything other than opening WhatsApp.
- **Don't** introduce a second typeface; use the width axis and weight of Archivo instead.
