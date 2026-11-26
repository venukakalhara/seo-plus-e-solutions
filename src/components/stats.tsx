'use client';
import { useEffect, useRef, useState } from 'react';
import { useLanguage } from './language';
export function Stats({motion=true}:{motion?:boolean}) {
  const {t}=useLanguage(); const ref=useRef<HTMLDivElement>(null);
  const [progress,setProgress]=useState(0);
  const elapsed=useRef(0);
  useEffect(()=>{
    let previous=performance.now();
    const timer=window.setInterval(()=>{
      const now=performance.now(),delta=now-previous;previous=now;
      const box=ref.current?.getBoundingClientRect();
      if(!motion||document.hidden||!box||box.bottom<80||box.top>window.innerHeight-40)return;
      elapsed.current=Math.min(5000,elapsed.current+Math.min(delta,150));
      const p=elapsed.current/5000;setProgress(p*p*(3-2*p));
      if(p===1)window.clearInterval(timer);
    },50);
    return()=>window.clearInterval(timer);
  },[motion]);
  return <div className="business-stats" ref={ref}>{[[50,'+','Projects Completed','අවසන් කළ ව්‍යාපෘති'],[30,'+','Happy Clients','තෘප්තිමත් පාරිභෝගිකයන්'],[5,'+','Years Experience','වසරක අත්දැකීම්'],[24,'/7','Support','සහාය']].map(([n,suffix,en,si])=><div key={en} aria-label={`${n}${suffix} ${t(String(en),String(si))}`}><strong aria-hidden="true">{Math.round(Number(n)*progress)}{suffix}</strong><span aria-hidden="true">{t(String(en),String(si))}</span></div>)}</div>;
}
