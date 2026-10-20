'use client';

import { useEffect, useRef } from 'react';

// All coordinates refer to the unchanged 1912 × 823 source photograph.
// Small spherical reprojection uses only its visible hemisphere; no invented back face.
const vertexSource = `
attribute vec2 position;
varying vec2 uv;
void main(){uv=position*.5+.5;gl_Position=vec4(position,0.,1.);}
`;
const fragmentSource = `
precision highp float;
varying vec2 uv;
uniform sampler2D photograph;
uniform float elapsed;
float laptop(vec2 p){
 return step(287.-.18*(p.x-1291.),p.y)*step(1291.-.21*(p.y-287.),p.x);
}
void main(){
 vec2 pixel=vec2(uv.x,1.-uv.y)*vec2(1912.,823.);
 vec2 n=(pixel-vec2(1249.,388.))/vec2(250.,253.);
 float radius=length(n);
 float globe=(1.-smoothstep(.89,.98,radius))*(1.-laptop(pixel));
 float turn=.085*sin(elapsed*.22);
 float z=sqrt(max(0.,1.-dot(n,n)));
 vec2 shifted=vec2(n.x*cos(turn)+z*sin(turn),n.y);
 vec2 samplePixel=vec2(1249.,388.)+shifted*vec2(250.,253.);
 globe*=1.-laptop(samplePixel);
 vec4 earth=texture2D(photograph,samplePixel/vec2(1912.,823.));
 gl_FragColor=vec4(earth.rgb,globe);
}
`;

export function HeroMotion({ enabled }: { enabled: boolean }) {
 const layer=useRef<HTMLDivElement>(null);const canvas=useRef<HTMLCanvasElement>(null);
 useEffect(()=>{
  const element=layer.current;const hero=element?.closest<HTMLElement>('.matched-hero');
  const image=hero?.querySelector<HTMLImageElement>('.matched-hero-art');
  if(!element||!hero||!image)return;
  function position(){
   if(!element||!hero||!image)return;
   const frame=image.getBoundingClientRect(),parent=hero.getBoundingClientRect();
   const scale=Math.max(frame.width/1912,frame.height/823);
   const [x,y]=getComputedStyle(image).objectPosition.split(' ').map(v=>parseFloat(v)/100);
   const width=1912*scale,height=823*scale;
   Object.assign(element.style,{width:`${width}px`,height:`${height}px`,left:`${frame.left-parent.left+(frame.width-width)*(Number.isFinite(x)?x:.5)}px`,top:`${frame.top-parent.top+(frame.height-height)*(Number.isFinite(y)?y:.5)}px`});
  }
  position();const observer=new ResizeObserver(position);observer.observe(hero);observer.observe(image);
  window.addEventListener('resize',position);
  return()=>{observer.disconnect();window.removeEventListener('resize',position);};
 },[]);
 useEffect(()=>{
  if(!enabled||!canvas.current)return;
  const surface=canvas.current;
  const gl=surface.getContext('webgl',{alpha:true,premultipliedAlpha:false,antialias:false,depth:false,powerPreference:'low-power'});
  if(!gl)return; // Original photo and CSS orbit lights remain available.
  const shaders:WebGLShader[]=[];
  function shader(type:number,source:string){
   const result=gl!.createShader(type);if(!result)return null;
   gl!.shaderSource(result,source);gl!.compileShader(result);shaders.push(result);
   return gl!.getShaderParameter(result,gl!.COMPILE_STATUS)?result:null;
  }
  const vertex=shader(gl.VERTEX_SHADER,vertexSource),fragment=shader(gl.FRAGMENT_SHADER,fragmentSource);
  if(!vertex||!fragment){shaders.forEach(s=>gl.deleteShader(s));return;}
  const program=gl.createProgram();if(!program)return;
  gl.attachShader(program,vertex);gl.attachShader(program,fragment);gl.linkProgram(program);
  if(!gl.getProgramParameter(program,gl.LINK_STATUS)){gl.deleteProgram(program);shaders.forEach(s=>gl.deleteShader(s));return;}
  const buffer=gl.createBuffer();const texture=gl.createTexture();
  gl.useProgram(program);gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
  gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
  const position=gl.getAttribLocation(program,'position');gl.enableVertexAttribArray(position);gl.vertexAttribPointer(position,2,gl.FLOAT,false,0,0);
  gl.bindTexture(gl.TEXTURE_2D,texture);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
  gl.uniform1i(gl.getUniformLocation(program,'photograph'),0);
  const clock=gl.getUniformLocation(program,'elapsed');
  let disposed=false,ready=false,visible=true,frame=0,last=0,time=0;
  const photo=new window.Image();
  function draw(now:number){
   frame=0;
   if(disposed||!ready||!visible||document.hidden)return;
   if(!last)last=now;
   if(now-last>=33){time+=Math.min(now-last,100)/1000;last=now;gl!.viewport(0,0,surface.width,surface.height);gl!.uniform1f(clock,time);gl!.drawArrays(gl!.TRIANGLES,0,6);}
   frame=requestAnimationFrame(draw);
  }
  function resume(){last=0;if(ready&&visible&&!document.hidden&&!frame&&!disposed)frame=requestAnimationFrame(draw);}
  function visibility(){if(document.hidden){cancelAnimationFrame(frame);frame=0;}else resume();}
  const observer=new IntersectionObserver(entries=>{
   visible=entries[0].isIntersecting;
   layer.current?.setAttribute('data-visible',String(visible));
   if(visible)resume();else{cancelAnimationFrame(frame);frame=0;}
  });
  if(layer.current)observer.observe(layer.current);
  document.addEventListener('visibilitychange',visibility);
  const lost=(event:Event)=>{event.preventDefault();cancelAnimationFrame(frame);frame=0;ready=false;};
  surface.addEventListener('webglcontextlost',lost);
  photo.onload=()=>{
   if(disposed)return;
   gl.bindTexture(gl.TEXTURE_2D,texture);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,photo);ready=true;resume();
  };
  photo.src='/hero-reference-v2.png';
  return()=>{disposed=true;photo.onload=null;cancelAnimationFrame(frame);observer.disconnect();document.removeEventListener('visibilitychange',visibility);surface.removeEventListener('webglcontextlost',lost);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);gl.deleteTexture(texture);gl.deleteBuffer(buffer);gl.deleteProgram(program);shaders.forEach(s=>gl.deleteShader(s));};
 },[enabled]);
 return <div className="hero-motion-layer" ref={layer} aria-hidden="true" data-enabled={enabled}>
  <canvas ref={canvas} width={1434} height={617}/>
  <svg className="hero-orbit-lights" viewBox="0 0 1912 823" fill="none">
   <defs><filter id="orbit-light-glow" x="-200%" y="-200%" width="500%" height="500%"><feGaussianBlur stdDeviation="3"/></filter><mask id="orbit-laptop-mask"><rect width="1912" height="823" fill="white"/><path d="M1290 286 Q1287 280 1302 275 L1700 211 Q1728 202 1723 230 L1655 626 L1218 619 Z" fill="black"/></mask></defs>
   <g mask="url(#orbit-laptop-mask)">
    {[
     'M 854 341 C 840 165 1110 173 1390 310 C 1700 455 1735 637 1455 650 C 1200 661 860 487 854 341 Z',
     'M 906 650 C 1020 471 1390 128 1642 108 C 1860 85 1780 454 1496 633 C 1250 790 826 775 906 650 Z',
     'M 1034 559 C 879 344 902 149 1100 111 C 1305 74 1525 330 1515 522 C 1505 731 1185 763 1034 559 Z',
    ].map((d,i)=><g key={d} className={`orbit-light-track orbit-light-${i}`}><path d={d} pathLength="1000" stroke="#ffcc49" strokeWidth="7" strokeDasharray="12 988" filter="url(#orbit-light-glow)" opacity=".75"/><path d={d} pathLength="1000" stroke="#ffe6a3" strokeWidth="2" strokeDasharray="3 997" strokeLinecap="round"/></g>)}
   </g>
  </svg>
  <svg className="laptop-logo-animation" viewBox="0 0 1912 823" fill="none">
   <defs>
    <clipPath id="laptop-logo-zone"><path d="M1310 365 L1610 318 L1602 505 L1302 530 Z"/></clipPath>
    <mask id="original-laptop-logo" maskUnits="userSpaceOnUse" x="1290" y="310" width="340" height="230" style={{maskType:'luminance'}}>
     <image href="/hero-reference-v2.png" width="1912" height="823"/>
    </mask>
    <linearGradient id="logo-gold-sweep"><stop stopColor="#ffd15a" stopOpacity="0"/><stop offset=".38" stopColor="#f0b428" stopOpacity=".85"/><stop offset=".55" stopColor="#ffe9a3"/><stop offset="1" stopColor="#ffd15a" stopOpacity="0"/></linearGradient>
    <filter id="logo-halo" x="-25%" y="-25%" width="150%" height="150%"><feGaussianBlur stdDeviation="5"/></filter>
   </defs>
   <g clipPath="url(#laptop-logo-zone)">
    <g className="logo-breathing-halo" filter="url(#logo-halo)"><g mask="url(#original-laptop-logo)"><rect x="1290" y="310" width="340" height="230" fill="#ffc94b"/></g></g>
    <g mask="url(#original-laptop-logo)"><rect className="logo-visible-sweep" x="1190" y="310" width="145" height="230" fill="url(#logo-gold-sweep)"/></g>
   </g>
  </svg>
 </div>;
}
