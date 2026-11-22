'use client';
import { useEffect, useId, useRef, useState } from 'react';
import { Pause, Play, TrendingUp } from 'lucide-react';
import { useLanguage } from './language';

const initial=[28,31,29,37,34,40,46,43,52,48,55,59,54,62,58,67,64,72,68,76];
export function GrowthChart({motion}:{motion:boolean}) {
 const {t}=useLanguage(); const id=useId().replace(/:/g,'');
 const root=useRef<HTMLElement>(null);const [paused,setPaused]=useState(false);
 const [values,setValues]=useState(initial);const [visible,setVisible]=useState(false);
 useEffect(()=>{const observer=new IntersectionObserver(([entry])=>setVisible(entry.isIntersecting));if(root.current)observer.observe(root.current);return()=>observer.disconnect();},[]);
 useEffect(()=>{
  if(!motion||paused||!visible)return;
  let frame=0,previous=0,elapsed=0;let from=initial,to=initial;let tick=0;
  const animate=(now:number)=>{
   if(document.hidden){previous=0;frame=requestAnimationFrame(animate);return;}
   if(previous)elapsed+=Math.min(now-previous,80);previous=now;
   if(elapsed>=2600){elapsed=0;tick++;from=to;to=[...from.slice(1),Math.round(57+18*Math.sin(tick*.7)+9*Math.cos(tick*1.8))];}
   const blend=Math.min(elapsed/850,1);const smooth=blend*blend*(3-2*blend);
   setValues(from.map((v,i)=>v+(to[i]-v)*smooth));frame=requestAnimationFrame(animate);
  };
  frame=requestAnimationFrame(animate);return()=>cancelAnimationFrame(frame);
 },[motion,paused,visible]);
 const points=values.map((v,i)=>[42+i*24,184-v*1.45]);
 const line=points.map(([x,y],i)=>`${i?'L':'M'}${x.toFixed(2)},${y.toFixed(2)}`).join(' ');
 const last=points[points.length-1];
 return <section ref={root} className="growth-dashboard" aria-label={t('Illustrative growth dashboard','ආදර්ශ වර්ධන දත්ත පුවරුව')}>
  <header className="growth-heading"><div><span className="growth-overline">SEO PLUS / INSIGHTS</span><h3>{t('Momentum, visualized.','වර්ධනය දකින්න.')}</h3></div><span className="growth-demo">{t('Demo data','ආදර්ශ දත්ත')}</span></header>
  <div className="growth-summary"><div><span>{t('Activity index','ක්‍රියාකාරකම් දර්ශකය')}</span><strong>{Math.round(values[values.length-1])}<small>/ 100</small></strong></div><div className="growth-summary-note"><TrendingUp size={20}/><span>{t('Ideas into progress','අදහස් තුළින් ප්‍රගතිය')}</span></div></div>
  <svg className="growth-plot" viewBox="0 0 540 220" role="img" aria-label={t('Animated illustrative activity index, from zero to one hundred. Not actual customer results.','ශුන්‍යයේ සිට සියය දක්වා ආදර්ශ ක්‍රියාකාරකම් දර්ශකය. සැබෑ පාරිභෝගික ප්‍රතිඵල නොවේ.')}>
   <defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop stopColor="#f4cb62" stopOpacity=".3"/><stop offset="1" stopColor="#f4cb62" stopOpacity="0"/></linearGradient></defs>
   {[0,25,50,75,100].map(v=><g key={v}><line x1="42" x2="516" y1={184-v*1.45} y2={184-v*1.45} stroke="#ffffff10" strokeDasharray="3 6"/><text x="8" y={188-v*1.45} fill="#8895a7" fontSize="12">{v}</text></g>)}
   <path d={`${line} L498,184 L42,184 Z`} fill={`url(#${id})`}/><path d={line} fill="none" stroke="#f3cc6c" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round"/>
   <circle cx={last[0]} cy={last[1]} r="10" fill="#f3cc6c22"/><circle cx={last[0]} cy={last[1]} r="4" fill="#fff0b4"/>
   <text x="42" y="213" fill="#8895a7" fontSize="12">{t('Earlier','පෙර')}</text><text x="498" y="213" textAnchor="end" fill="#cdbd94" fontSize="12">{t('Latest sample','නවතම අගය')}</text>
  </svg>
  <footer className="growth-footer"><span>{t('Simulated activity · not client results','ආදර්ශ දත්ත · පාරිභෝගික ප්‍රතිඵල නොවේ')}</span><button onClick={()=>setPaused(!paused)} disabled={!motion} aria-pressed={paused||!motion} aria-label={t(paused?'Play chart animation':'Pause chart animation',paused?'ප්‍රස්තාර චලනය අරඹන්න':'ප්‍රස්තාර චලනය නවත්වන්න')}>{paused||!motion?<Play size={14}/>:<Pause size={14}/>} {t(paused||!motion?'Paused':'Animating',paused||!motion?'නවතා ඇත':'චලනය වේ')}</button></footer>
 </section>;
}
