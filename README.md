# 143.lat

Freelance site for Deepanshu Lathar: websites, automation and AI agents. Next.js 16 (App Router, static prerender), GSAP + ScrollTrigger + SplitText, Lenis, React Three Fiber for the clay objects.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build
```

Content lives in `src/content/` (`site.ts` contact/pricing/FAQ/proof, `services.ts`, `work.ts`). Pages never hard-code copy.

## Animations

All shared motion code is in `src/lib/motion.ts`: Lenis set-up, eases (`EASE`), media queries (`MQ`) and the hooks
`useLenis`, `useSplitReveal`, `useScrubFill`, `usePinScenes`, `useMagnetic`, `useVelocityCarousel`.
Every section runs inside `useGSAP`, so it is reverted on route change. With reduced motion on there is no pinning, scrubbing or 3D, only 0.4 s fades (`fadeIn`). On phones, pins are capped at 150vh, the 3D is swapped for WebP stills and parallax runs at x0.4 (`px()`).

| Animation | File | Adjust |
|---|---|---|
| Smooth scroll | `lib/motion.ts` `useLenis` | `lerp`, `wheelMultiplier` |
| Hero intro (chars rise, then cards scale in) | `components/home/Hero.tsx` | `useSplitReveal(... stagger, duration)`; `.hc-par` `scale 0.92 → 1`, `0.06 s` stagger, delay `1.1 s` |
| Hero audience ticker | `Hero.tsx` (roll timeline) | `+=1.6` hold + `0.6` roll = 2.2 s per word |
| Hero scroll (headline dims, cards drift outward and fade, clay lags) | `Hero.tsx` ScrollTrigger on `.hero`, `top top` → `bottom top`, no pin | side cards `±12vw`, bottom pair `±6vw` / `18vh`; mouse parallax 3 layers, `4 / 8 / 12 px` |
| Hero cards | `components/home/HeroCards.tsx` | 8 hand-placed cards (`CARDS`, base 300×190 / 170×300); `placeCards()` scales the whole composition (`--k`) to the largest size that keeps every card out of the safe zone (eyebrow, headline, subline, CTAs + 32 px) with parallax and hover, no card overlap, edge bleed ≤ 15%. Phones: `HeroRow`, 4 portrait cards that pan and pause on touch. Videos play only on screen after `window.load`; posters only with reduced motion. Check with `node tools/check-hero.mjs 1440 900 <base>` |
| Clay 3D objects | `components/clay/` | positions, sizes, drift in `CLAY` / `KNOT`; WebP fallbacks via `node tools/clay-png.mjs` (dev server running) |
| Manifesto scroll fill | `components/home/Manifesto.tsx` | `useScrubFill(ref, 'top 75%', 'bottom 40%')` |
| Services stack (Build, Automate, AI, Grow) | `components/home/ServicesShowcase.tsx` | next card slides over in `0.45`, outgoing card scales to `0.9` + shade `0.55`; screenshots per card in `MOCKS` (positions `.m1`–`.m4` in `globals.css`); parallax `45 × depth`, mouse tilt `10°/7°`. Phones: sticky stacking, scale `0.92` |
| Curtain (light rises over the stage) | `ServicesShowcase.tsx` last segment + `.showcase + .paper { margin-top: -100vh }` | scale `0.95`, dim `0.4` |
| Big service list | `components/home/ServiceList.tsx` | colour/weight peak at `0.25 → 1.25`; previews come from `SERVICE_PROJECTS` in `services.ts` (empty = no preview), cycle every `1.4 s` |
| Work carousel | `components/home/WorkCarousel.tsx` | all of `PROJECTS`; `spacing` (vw), blur `3px`, lift `2vh`, fling `260`; friction in `useVelocityCarousel`. Scroll length is `.wc-pin` height in `globals.css` (sticky, like the hero; a GSAP pin here caused layout shift) |
| Inner page title | `components/ui/Reveal.tsx` `Title` | stagger `0.04`, rotation ±4° |
| Expanding hero image | `components/inner/Inner.tsx` `ExpandHero` | `start`/`end`, inset `2%`, overlay `0.25` |
| Line reveals | `Reveal.tsx` `Lines` | stagger `0.08`, start `top 80%` |
| Pill switcher, image strip | `Inner.tsx` | scroll-spy `top 55%`; strip slide width `64vw` |
| Header hide, menu, cursor, page transitions | `components/shell/Shell.tsx` | header `0.4 s`; menu clip-path `0.7 s`; curtain `0.6 s power3.inOut` |

Project clips (hero cards, the service-list preview and the Selected work carousel, all through `components/ui/Clip.tsx` + `useClips`; the carousel plays only its centred project): `node tools/cards.mjs [land|port|tall] [slug …]` records each project at 1440×912 (landscape), 390×688 @2x (portrait) or 390×845 @2x (tall, the carousel phone screen) while a scripted scroll / hover / click plays and returns to its start (the LinkedIn chat is the recreated UI at `/capture/linkedin-autopilot`, so it needs `npm run dev`). Then `python3 tools/cards-build.py [variant/slug …]` resamples to 30 fps, crossfades the loop point and encodes AV1 + H.264 plus a poster into `public/cards/`: `land` 600×380 and `port` 340×600 under 400 KB each, `lg` 1056×660 (carousel laptop, cut from the landscape recording) and `tall` 400×866 under 850 / 700 KB. `--sheet` writes a contact sheet to `.ref/cards/sheet.jpg`.

Screenshots: `node tools/shots.mjs [slug …]` refreshes `public/work/<slug>/{desktop,mobile}.webp` from the live sites (1440 and 390, 2× DPR). Internal tools are captured from the dev-only `/capture/<slug>` recreated UIs (`npm run dev` first). Project list, links and tags: `PROJECTS` in `src/content/work.ts`.

Checks: `node tools/qa-home.mjs <base> <out> <w> <h>` (section shots, layout shift, console errors), `node tools/links.mjs <base>` (every link on every sitemap page), `node tools/check-hero.mjs <w> <h> <base>`.

## Before launch

- Prices in `src/content/site.ts` (`PRICING`) are drafts. Payment terms and timelines in `FAQ` too.
- `CONTACT.cal` is a guessed Cal.com link.
- Testimonials were removed. Add a section back only with real, approved quotes.
- Picapool numbers in `work.ts` say "Shared once Picapool signs off". The Picapool CRM, the AI analyst and the LinkedIn autopilot show recreated UIs (labelled "Recreated UI"); swap in real screens by replacing their `desktop.webp`.
- `hello@deepanshulathar.com` must exist as a mailbox.
