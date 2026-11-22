"""Rebuild the original motion-graphics intro: pip install pillow numpy imageio-ffmpeg."""
from pathlib import Path
import math, subprocess, tempfile, wave
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import imageio_ffmpeg

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'public' / 'media'
OUT.mkdir(exist_ok=True)
W, H, FPS, SECONDS = 1280, 720, 24, 36
GOLD = (255, 211, 91)
scenes = [
 ('THE NEXT CHAPTER', ['Big ideas.', 'Brighter futures.'], ['Technology. Creativity. Strategy.', 'Built around your business.']),
 ('OUR VISION', ['A smarter', 'tomorrow.'], ['A future where every business can thrive', 'with the power of digital technology.']),
 ('OUR MISSION', ['Make ambition', 'work.'], ['Turn ideas into practical digital solutions', 'that connect, simplify and support growth.']),
 ('CREATE & CONNECT', ['Stand out.', 'Be discovered.'], ['Web development  /  Digital marketing', 'SEO strategies for your next chapter.']),
 ('SIMPLIFY & GROW', ['Less repetition.', 'More possibility.'], ['Business automation and connected systems.', 'More space for the work that matters.']),
 ('SEO PLUS E-SOLUTIONS', ['Your vision.', 'Our expertise.'], ['Let\u2019s build your smarter tomorrow.', 'Start a conversation with SEO PLUS.']),
]
font_path = 'C:/Windows/Fonts/arial.ttf'
bold_path = 'C:/Windows/Fonts/arialbd.ttf'
fonts = {s:ImageFont.truetype(bold_path if s>=60 else font_path,s) for s in [18,22,27,72]}
bg = Image.open(ROOT/'public/hero-reference-v2.png').convert('RGB').resize((W,H))
shade = Image.new('RGBA',(W,H)); sd=ImageDraw.Draw(shade)
for x in range(W): sd.line((x,0,x,H),fill=(2,6,12,int(235-130*x/W)))
base=Image.alpha_composite(bg.convert('RGBA'),shade)
rng=np.random.default_rng(42)
stars=rng.random((90,4))

def frame(t):
    im=base.copy(); d=ImageDraw.Draw(im)
    # Rotating perspective globe and orbital light trails.
    cx,cy,r=1040,355,246
    for lat in range(-60,90,30):
        a=math.radians(lat); ry=cy-r*math.sin(a)
        rr=r*math.cos(a)
        d.ellipse((cx-rr,ry-rr*.12,cx+rr,ry+rr*.12),outline=(129,100,47,130),width=1)
    for meridian in range(12):
        points=[]
        a=meridian*math.pi/6+t*.15
        for k in range(65):
            lat=-math.pi/2+k*math.pi/64
            x=cx+r*math.cos(lat)*math.sin(a)
            y=cy+r*math.sin(lat)
            points.append((x,y))
        d.line(points,fill=(181,139,57,150),width=1)
    for j in range(3):
        a=t*.45+j*2.094; x=cx+290*math.cos(a); y=cy+100*math.sin(a)
        d.arc((cx-290,cy-100,cx+290,cy+100),start=math.degrees(a)-65,end=math.degrees(a),fill=GOLD,width=2)
        d.ellipse((x-4,y-4,x+4,y+4),fill=(255,236,176))
    for x,y,s,v in stars:
        px=(x*W+t*(8+v*15))%W; py=(y*H-t*4)%H
        b=int(95+100*(.5+.5*math.sin(t*2+x*20)))
        d.ellipse((px,py,px+1+s*2,py+1+s*2),fill=(b,int(b*.79),int(b*.42)))
    d.text((76,56),'SEO',font=fonts[27],fill='white');d.text((138,56),'PLUS',font=fonts[27],fill=GOLD)
    d.text((76,94),'E - S O L U T I O N S',font=fonts[18],fill=(161,170,182))
    idx=min(5,int(t//6)); local=t-idx*6
    opacity=min(1,local/.65,(6-local)/.5)
    overlay=Image.new('RGBA',(W,H)); od=ImageDraw.Draw(overlay)
    dy=int(22*(1-min(1,local/.8))**3)
    label,title,body=scenes[idx]
    od.line((78,211+dy,121,211+dy),fill=GOLD,width=3)
    od.text((137,199+dy),label,font=fonts[18],fill=GOLD)
    for i,line in enumerate(title):od.text((72,247+i*87+dy),line,font=fonts[72],fill='white' if i==0 else GOLD)
    for i,line in enumerate(body):od.text((78,459+i*39+dy),line,font=fonts[27],fill=(207,215,225))
    overlay.putalpha(overlay.getchannel('A').point(lambda a:int(a*max(0,opacity))))
    im=Image.alpha_composite(im,overlay); d=ImageDraw.Draw(im)
    d.line((78,625,1200,625),fill=(61,62,60),width=2)
    d.line((78,625,78+1122*t/SECONDS,625),fill=GOLD,width=3)
    d.text((78,652),'IT SOLUTIONS   /   DIGITAL GROWTH   /   BUSINESS AUTOMATION',font=fonts[18],fill=(170,179,190))
    fade=min(1,t/.5,(SECONDS-t)/.8)
    return Image.blend(Image.new('RGB',(W,H)),im.convert('RGB'),max(0,fade))

# Original synthesized ambient score; no third-party music or sampled recordings.
rate=44100
ts=np.arange(rate*SECONDS)/rate
audio=np.zeros_like(ts)
for start,notes in [(0,[130.81,196,261.63]),(6,[103.83,155.56,207.65]),(12,[116.54,174.61,233.08]),(18,[87.31,130.81,174.61]),(24,[103.83,155.56,207.65]),(30,[130.81,196,261.63])]:
    local=ts-start; env=np.clip(local/1.2,0,1)*np.clip((7-local)/1.5,0,1)
    for f in notes:audio+=.025*env*(np.sin(2*np.pi*f*ts)+.3*np.sin(2*np.pi*(f*2+.2)*ts))
for beat in np.arange(0,SECONDS,.5):
    q=ts-beat; env=np.exp(-np.maximum(q,0)*12)*(q>=0)
    audio+=.045*env*np.sin(2*np.pi*440*q)
audio*=np.clip(ts/2,0,1)*np.clip((SECONDS-ts)/2,0,1)
with tempfile.TemporaryDirectory() as temp:
    wav=Path(temp)/'score.wav'
    with wave.open(str(wav),'wb') as f:
        f.setnchannels(1);f.setsampwidth(2);f.setframerate(rate);f.writeframes((audio*32767).astype('<i2').tobytes())
    cmd=[imageio_ffmpeg.get_ffmpeg_exe(),'-y','-f','rawvideo','-vcodec','rawvideo','-pix_fmt','rgb24','-s',f'{W}x{H}','-r',str(FPS),'-i','-','-i',str(wav),'-c:v','libx264','-preset','fast','-crf','23','-pix_fmt','yuv420p','-c:a','aac','-b:a','128k','-movflags','+faststart','-shortest',str(OUT/'seo-plus-intro.mp4')]
    with open(Path(temp)/'render.log','w') as log:
        p=subprocess.Popen(cmd,stdin=subprocess.PIPE,stderr=log)
        for n in range(FPS*SECONDS):
            im=frame(n/FPS)
            if n==48:im.save(OUT/'intro-poster.jpg',quality=90)
            if n in [192,336,480,624,768]:im.save(Path(temp)/f'frame-{n}.jpg')
            p.stdin.write(im.tobytes())
            if n%144==0:print(f'Rendered {n/FPS:.0f}s / {SECONDS}s',flush=True)
        p.stdin.close(); code=p.wait()
        if code:raise RuntimeError('Video encoding failed')
    previews=[frame(t).resize((640,360)) for t in [2,8,14,20,26,32]]
    sheet=Image.new('RGB',(1280,1080))
    for i,preview in enumerate(previews):sheet.paste(preview,((i%2)*640,(i//2)*360))
    sheet.save(OUT/'intro-storyboard.jpg',quality=90)
print('Created public/media/seo-plus-intro.mp4',flush=True)
