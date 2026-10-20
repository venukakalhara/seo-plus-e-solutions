'use client';
import { useEffect, useRef, useState } from 'react';
import { useLanguage } from './language';
export function Stats() {
  const {t}=useLanguage(); const ref=useRef<HTMLDivElement>(null);
  const [progress,setProgress]=useState(1);
  useEffect(()=>{
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let frame=0; let started=false;
    const observer=new IntersectionObserver(entries=>{
      if (!entries[0].isIntersecting || started) return;
      started=true; const start=performance.now();
      function tick(now:number) {const p=Math.min((now-start)/1400,1);setProgress(1-Math.pow(1-p,3));if(p<1)frame=requestAnimationFrame(tick);}
      frame=requestAnimationFrame(tick);observer.disconnect();
    },{threshold:.2});
    if(ref.current)observer.observe(ref.current);
    return ()=>{cancelAnimationFrame(frame);observer.disconnect();};
  },[]);
  return <div className="business-stats" ref={ref}>{[[50,'+','Projects Completed','අවසන් කළ ව්‍යාපෘති'],[30,'+','Happy Clients','තෘප්තිමත් පාරිභෝගිකයන්'],[5,'+','Years Experience','වසරක අත්දැකීම්'],[24,'/7','Support','සහාය']].map(([n,suffix,en,si])=><div key={en} aria-label={`${n}${suffix} ${t(String(en),String(si))}`}><strong aria-hidden="true">{Math.round(Number(n)*progress)}{suffix}</strong><span aria-hidden="true">{t(String(en),String(si))}</span></div>)}</div>;
}
