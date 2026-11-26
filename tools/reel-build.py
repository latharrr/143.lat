# Assemble the recorded shots (tools/reel.mjs) into the hero showreel and encode it.
# Usage: python3 tools/reel-build.py desktop|mobile [--sheet]
# Each shot is resampled to 30 fps over SHOT seconds (latest frame at or before each tick), resized to the output size,
# and joined with a FADE-frame crossfade. The last shot also crossfades into the first, and the reel starts after that
# overlap, so the loop point is seamless. Writes public/reel/<mode>-{av1,h264}.mp4, <mode>-poster.webp and
# src/content/reel.json (project-name chip timeline).
import json, os, subprocess, sys, shutil
from PIL import Image

MODE = sys.argv[1]
SHEET = '--sheet' in sys.argv
FPS, SHOT, FADE = 30, 1.7, 6
ORDER = ['tulips-oven', 'gapl', 'proofmart', 'yourprofessionals', 'picapool-acquisition-campaign', 'picapool-crm-automation',
         'picapool-ai-data-analyst', 'rumour-mill', 'linkedin-autopilot', 'sangsafar', 'spraykart']
NAMES = {'tulips-oven': 'Tulip’s Oven', 'gapl': 'Gapl', 'proofmart': 'ProofMart', 'yourprofessionals': 'YourProfessionals',
         'picapool-acquisition-campaign': 'Picapool campaign', 'picapool-crm-automation': 'Picapool CRM · Recreated UI',
         'picapool-ai-data-analyst': 'AI data analyst · Recreated UI', 'rumour-mill': 'Beyond the Rumour Mill',
         'linkedin-autopilot': 'LinkedIn autopilot · Recreated UI', 'sangsafar': 'SangSafar · Staging', 'spraykart': 'Spraykart'}
OUT = (1280, 800) if MODE == 'desktop' else (540, 960)
# Size budgets from the brief (bytes): desktop 2.5 MB, mobile 1.2 MB, each codec.
BUDGET = 2_400_000 if MODE == 'desktop' else 1_150_000


def fit(im):
    """Cover-fit to OUT, anchored top (pages read from the top)."""
    w, h = im.size
    s = max(OUT[0] / w, OUT[1] / h)
    im = im.resize((round(w * s), round(h * s)), Image.LANCZOS)
    x = (im.width - OUT[0]) // 2
    return im.crop((x, 0, x + OUT[0], OUT[1]))


def shot_frames(slug):
    d = f'.ref/reel/{MODE}/{slug}'
    meta = json.load(open(f'{d}/times.json'))
    times = meta['times']
    start = times[0] + 0.12
    n = round(SHOT * FPS)
    out, j = [], 0
    for i in range(n):
        t = start + i / FPS
        while j + 1 < len(times) and times[j + 1] <= t:
            j += 1
        out.append(f'{d}/{j:04d}.jpg')
    return out


shots = {s: shot_frames(s) for s in ORDER}
if SHEET:
    cols = 5
    th = (OUT[0] // 4, OUT[1] // 4)
    sheet = Image.new('RGB', (th[0] * cols, th[1] * len(ORDER)), 'white')
    for r, s in enumerate(ORDER):
        fs = shots[s]
        for c in range(cols):
            im = fit(Image.open(fs[round(c * (len(fs) - 1) / (cols - 1))]).convert('RGB')).resize(th)
            sheet.paste(im, (c * th[0], r * th[1]))
    sheet.save(f'.ref/reel/sheet-{MODE}.jpg', quality=80)
    print('sheet', f'.ref/reel/sheet-{MODE}.jpg')
    sys.exit()

# Build the sequence: shots back to back; each boundary crossfades the last FADE frames of one into the first FADE of
# the next. Loop: the first FADE frames of shot 1 are blended onto the end and skipped at the start.
cache = {}
def load(p):
    if p not in cache:
        cache[p] = fit(Image.open(p).convert('RGB'))
    return cache[p]

seq, chips = [], []
for k, s in enumerate(ORDER):
    fs = shots[s]
    nxt = shots[ORDER[(k + 1) % len(ORDER)]]
    body = fs[FADE:]  # every shot's first FADE frames are blended into the previous crossfade (shot 1's into the last)
    chips.append({'t': round(len(seq) / FPS, 3), 'name': NAMES[s], 'slug': s})
    for p in body[:-FADE]:
        seq.append(load(p))
    for i in range(FADE):
        a = (i + 1) / (FADE + 1)
        seq.append(Image.blend(load(body[len(body) - FADE + i]), load(nxt[i]), a))
# Chip switches at the middle of each crossfade.
for c in chips[1:]:
    c['t'] = round(c['t'] - FADE / 2 / FPS, 3)
dur = len(seq) / FPS
print(MODE, len(seq), 'frames', round(dur, 2), 's')

tmp = f'.ref/reel/{MODE}-frames'
shutil.rmtree(tmp, ignore_errors=True); os.makedirs(tmp)
for i, im in enumerate(seq):
    im.save(f'{tmp}/{i:05d}.png', compress_level=1)
os.makedirs('public/reel', exist_ok=True)
seq[0].save(f'public/reel/{MODE}-poster.webp', quality=78, method=6)
# Same shot timing in both modes, so one chip timeline (read by components/home/Showreel.tsx).
json.dump({'duration': round(dur, 3), 'chips': chips}, open('src/content/reel.json', 'w'), ensure_ascii=False, indent=1)

inp = ['-y', '-loglevel', 'error', '-framerate', str(FPS), '-i', f'{tmp}/%05d.png', '-pix_fmt', 'yuv420p', '-an']
def enc(name, args):
    out = f'public/reel/{MODE}-{name}.mp4'
    subprocess.run(['ffmpeg', *inp, *args, '-movflags', '+faststart', out], check=True)
    return out, os.path.getsize(out)

# AV1: lowest CRF that fits the budget.
for crf in [34, 38, 42, 46, 50]:
    out, size = enc('av1', ['-c:v', 'libsvtav1', '-preset', '4', '-crf', str(crf), '-g', '150', '-svtav1-params', 'tune=0'])
    print('av1 crf', crf, size)
    if size <= BUDGET: break
# H.264: two-pass at the bitrate the budget allows.
kbps = int(BUDGET * 8 / dur / 1000 * 0.94)
passlog = f'.ref/reel/{MODE}-x264'
for p in (1, 2):
    args = ['-c:v', 'libx264', '-preset', 'veryslow', '-profile:v', 'high', '-b:v', f'{kbps}k', '-pass', str(p), '-passlogfile', passlog, '-g', '150']
    if p == 1:
        subprocess.run(['ffmpeg', *inp, *args, '-f', 'mp4', '/dev/null'], check=True)
    else:
        out, size = enc('h264', args)
print('h264', kbps, 'kbps', size)
