#!/bin/zsh
# Builds public/media from .ref/rec captures + local project assets. Re-run after recapturing.
set -e
cd "${0:A:h}/.."
M=public/media; mkdir -p $M
for n in proofmart gapl lputv intent air tbv yp; do
  src=.ref/rec/$n-tall.png
  # ping-pong pan down the page: seamless loop, 8s
  vf="crop=1280:960:0:'1440*(0.5-0.5*cos(2*PI*t/8))',scale=560:420,format=yuv420p"
  ffmpeg -loglevel error -y -loop 1 -framerate 24 -t 8 -i $src -vf "$vf" -c:v libx264 -preset slow -crf 30 -movflags +faststart -an $M/$n.mp4
  ffmpeg -loglevel error -y -loop 1 -framerate 24 -t 8 -i $src -vf "$vf" -c:v libvpx-vp9 -b:v 0 -crf 44 -row-mt 1 -an $M/$n.webm
  ffmpeg -loglevel error -y -i $src -vf "crop=1280:960:0:0,scale=560:420" -q:v 3 $M/$n-poster.jpg
  ffmpeg -loglevel error -y -i $src -vf "crop=1280:800:0:0,scale=1600:-1" -q:v 3 $M/$n-hero.jpg
  ffmpeg -loglevel error -y -i $src -vf "crop=1280:800:0:800,scale=1280:-1" -q:v 3 $M/$n-2.jpg
  ffmpeg -loglevel error -y -i $src -vf "crop=1280:800:0:1600,scale=1280:-1" -q:v 3 $M/$n-3.jpg
done
S=~/Desktop/Sangsafar/docs/screenshots
ffmpeg -loglevel error -y -i $S/04-discover-390.png -vf "scale=360:-1" -q:v 3 $M/sangsafar-phone.jpg
for f in 01-landing 04-discover 06-matches 10-chat-accepted; do ffmpeg -loglevel error -y -i $S/$f-1280.png -vf "scale=1280:-1" -q:v 3 $M/sangsafar-$f.jpg; done
ffmpeg -loglevel error -y -i $S/06-matches-1280.png -vf "crop=iw:iw*0.75:0:0,scale=560:420" -q:v 3 $M/sangsafar-poster.jpg
P=~/Desktop/picapool/picapool-9x16-v1-explainer.mp4
ffmpeg -loglevel error -y -ss 2 -t 6 -i $P -vf "scale=360:640,format=yuv420p" -c:v libx264 -crf 30 -preset slow -movflags +faststart -an $M/picapool-film.mp4
ffmpeg -loglevel error -y -ss 2 -t 6 -i $P -vf "scale=360:640" -c:v libvpx-vp9 -b:v 0 -crf 44 -an $M/picapool-film.webm
ffmpeg -loglevel error -y -ss 2 -i $P -frames:v 1 -vf "scale=360:640" -q:v 3 $M/picapool-film-poster.jpg
ffmpeg -loglevel error -y -i ~/portfolio/assets/portrait.webp -vf "scale=640:-1" -q:v 3 $M/deepanshu.jpg
ls -la $M | awk '{print $5, $9}'
