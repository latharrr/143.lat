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
Every section runs inside `useGSAP`, so it is reverted on route change. With reduced motion on there is no pinning, scrubbing or 3D, only 0.4 s fades (`fadeIn`). On phones, pins are capped at 150vh, the 3D is swapped for PNGs and parallax runs at x0.4 (`px()`).

| Animation | File | Adjust |
|---|---|---|
| Smooth scroll | `lib/motion.ts` `useLenis` | `lerp`, `wheelMultiplier` |
| Hero intro (chars rise, cards pop) | `components/home/Hero.tsx` | `useSplitReveal(... stagger, duration)`, cards `back.out(1.6)` `stagger: 0.05` |
| Hero audience ticker | `Hero.tsx` (roll timeline) | `+=1.6` hold + `0.6` roll = 2.2 s per word |
| Hero pin (headline dims, cards orbit, clay drift) | `Hero.tsx` `usePinScenes(root, 2, …)` | `2` = 200vh; card `data-speed` in `SLOTS`; orbit `20 * dir` |
| Hero rest layout | `Hero.tsx` first `useGSAP` | slots in `SLOTS`/`PILLS`; the solver pushes cards outward until they clear the headline and CTAs. Check with `node tools/check-hero.mjs 1440 800` |
| Clay 3D objects | `components/clay/` | positions, sizes, drift in `CLAY` / `KNOT`; PNG fallbacks via `node tools/clay-png.mjs` (dev server running) |
| Manifesto scroll fill | `components/home/Manifesto.tsx` | `useScrubFill(ref, 'top 75%', 'bottom 40%')` |
| Services stage (4 scenes) | `components/home/ServicesShowcase.tsx` | segment windows in the loop: mockups `0.2`, copy `0.075`, bg `0.2` |
| Curtain (light rises over the stage) | `ServicesShowcase.tsx` last segment + `.showcase + .paper { margin-top: -100vh }` | scale `0.95`, dim `0.4` |
| Big service list | `components/home/ServiceList.tsx` | colour/weight peak at `0.25 → 1.25`; preview card `quickTo 0.5`, tilt clamp ±10 |
| Work carousel | `components/home/WorkCarousel.tsx` | `spacing` (vw), blur, pin length `220%`; friction in `useVelocityCarousel` |
| Inner page title | `components/ui/Reveal.tsx` `Title` | stagger `0.04`, rotation ±4° |
| Expanding hero image | `components/inner/Inner.tsx` `ExpandHero` | `start`/`end`, inset `2%`, overlay `0.25` |
| Line reveals | `Reveal.tsx` `Lines` | stagger `0.08`, start `top 80%` |
| Pill switcher, image strip | `Inner.tsx` | scroll-spy `top 55%`; strip slide width `64vw` |
| Header hide, menu, cursor, page transitions | `components/shell/Shell.tsx` | header `0.4 s`; menu clip-path `0.7 s`; curtain `0.6 s power3.inOut` |

Media: `tools/media.sh` rebuilds `public/media` (pan loops from tall screenshots in `.ref/rec`, which is git-ignored; capture with `node tools/capture.mjs <name> <url>`).

## Before launch

- Prices in `src/content/site.ts` (`PRICING`) are drafts. Payment terms and timelines in `FAQ` too.
- `CONTACT.cal` is a guessed Cal.com link.
- Testimonials: replace the `placeholder` entries in `PROOF.testimonials`. Placeholders render in dev only.
- UniLyf and SLSPL have no logo file yet (text wordmarks). Add `src` in `PROOF.logos`.
- Picapool numbers in `work.ts` say "Shared once Picapool signs off". Real screens for the Picapool CRM, the AI analyst and the LinkedIn autopilot: add `image` (or `video`) to their entries in `work.ts`; until then they show drawn screens.
- `hello@deepanshulathar.com` must exist as a mailbox.
