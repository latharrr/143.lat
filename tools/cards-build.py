# Encode the project clips recorded by tools/cards.mjs (hero cards, service-list preview, Selected work carousel).
# Usage: python3 tools/cards-build.py [variant/slug ...] [--sheet]
# Each recording is resampled to 30 fps (latest frame at or before each tick) and resized: land 600x380 and port 340x600
# (cards, exact aspect), lg 1056x660 (carousel laptop, 16:10 from the land recording: 1% off the bottom) and tall 400x866
# (carousel phone, 9:19.5). Loop: the clip's first FADE frames are blended onto its end and skipped at the start, so
# the loop point is seamless (every action ends where it started). Writes public/cards/<variant>-<slug>-{av1,h264}.mp4
# and <variant>-<slug>.webp (the poster: frame 0, the same frame the video starts on).
import json, os, subprocess, sys, shutil
from PIL import Image, ImageFilter

FPS, DUR, FADE = 30, 5.8, 10
SIZE = {'land': (600, 380), 'port': (340, 600), 'lg': (1056, 660), 'tall': (400, 866)}
SRC = {'lg': 'land'}  # variant -> recording folder (default: same name)
# Bytes per file. Cards: brief says under 400 KB. Carousel cuts are bigger and only the centred project ever plays.
BUDGET = {'land': 385_000, 'port': 385_000, 'lg': 850_000, 'tall': 700_000}
args = [a for a in sys.argv[1:] if not a.startswith('--')]
SHEET = '--sheet' in sys.argv
clips = args or sorted(f'{v}/{s}' for v in SIZE for s in os.listdir(f'.ref/cards/{SRC.get(v, v)}') if os.path.isdir(f'.ref/cards/{SRC.get(v, v)}/{s}'))
os.makedirs('public/cards', exist_ok=True)


def frames(clip):
    v, slug = clip.split('/')
    d = f'.ref/cards/{SRC.get(v, v)}/{slug}'
    times = json.load(open(f'{d}/times.json'))['times']
    start = times[0] + 0.1
    out, j = [], 0
    for i in range(round(DUR * FPS)):
        t = start + i / FPS
        while j + 1 < len(times) and times[j + 1] <= t:
            j += 1
        out.append(f'{d}/{j:04d}.jpg')
    return out


def build(clip):
    variant, slug = clip.split('/')
    size = SIZE[variant]
    cache = {}
    def load(p):
        if p not in cache:
            im = Image.open(p).convert('RGB')
            h = round(im.height * size[0] / im.width)  # width-fit, then trim the bottom to the exact height (top-anchored)
            im = im.resize((size[0], h), Image.LANCZOS).crop((0, 0, size[0], size[1]))
            cache[p] = im.filter(ImageFilter.UnsharpMask(radius=0.8, percent=60, threshold=2))
        return cache[p]
    fs = frames(clip)
    body = fs[FADE:]
    seq = [load(p) for p in body[:-FADE]]
    for i in range(FADE):  # tail -> head crossfade
        seq.append(Image.blend(load(body[len(body) - FADE + i]), load(fs[i]), (i + 1) / (FADE + 1)))
    if SHEET:
        return seq
    tmp = f'.ref/cards/_frames'
    shutil.rmtree(tmp, ignore_errors=True); os.makedirs(tmp)
    for i, im in enumerate(seq):
        im.save(f'{tmp}/{i:05d}.png', compress_level=1)
    name = f'public/cards/{variant}-{slug}'
    seq[0].save(f'{name}.webp', quality=82, method=6)
    inp = ['-y', '-loglevel', 'error', '-framerate', str(FPS), '-i', f'{tmp}/%05d.png', '-pix_fmt', 'yuv420p', '-an']
    def enc(codec, a):
        out = f'{name}-{codec}.mp4'
        subprocess.run(['ffmpeg', *inp, *a, '-movflags', '+faststart', out], check=True)
        return os.path.getsize(out)
    for crf in [30, 34, 38, 42, 46]:
        av1 = enc('av1', ['-c:v', 'libsvtav1', '-preset', '4', '-crf', str(crf), '-g', '300', '-svtav1-params', 'tune=0'])
        if av1 <= BUDGET[variant]: break
    dur = len(seq) / FPS
    kbps = int(BUDGET[variant] * 8 / dur / 1000 * 0.93)
    log = '.ref/cards/_x264'
    a = lambda p: ['-c:v', 'libx264', '-preset', 'veryslow', '-profile:v', 'high', '-b:v', f'{kbps}k', '-maxrate', f'{kbps * 2}k', '-bufsize', f'{kbps * 2}k', '-pass', str(p), '-passlogfile', log, '-g', '300']
    subprocess.run(['ffmpeg', *inp, *a(1), '-f', 'mp4', '/dev/null'], check=True)
    h264 = enc('h264', a(2))
    print(f'{clip:42s} {len(seq)} f {dur:.2f}s  av1 crf{crf} {av1 // 1000}KB  h264 {kbps}k {h264 // 1000}KB  poster {os.path.getsize(name + ".webp") // 1000}KB')


if SHEET:
    cols = 6
    rows = []
    for c in clips:
        seq = build(c)
        th = (SIZE[c.split('/')[0]][0] // 2, SIZE[c.split('/')[0]][1] // 2)
        row = Image.new('RGB', (th[0] * cols, th[1]), 'white')
        for k in range(cols):
            row.paste(seq[round(k * (len(seq) - 1) / (cols - 1))].resize(th), (k * th[0], 0))
        rows.append(row)
    W = max(r.width for r in rows)
    sheet = Image.new('RGB', (W, sum(r.height for r in rows)), 'white')
    y = 0
    for r in rows:
        sheet.paste(r, (0, y)); y += r.height
    sheet.save('.ref/cards/sheet.jpg', quality=80)
    print('.ref/cards/sheet.jpg')
else:
    for c in clips:
        build(c)
