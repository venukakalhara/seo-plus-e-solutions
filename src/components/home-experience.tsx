'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Check, Code2, Search, Workflow, Layers3, MessageCircle, Package, ShieldCheck, Sparkles, MousePointer2, Pause, Play, ChevronRight } from 'lucide-react';
import { ReferenceHome } from './reference-home';
import { useLanguage } from './language';
import { site } from '@/lib/site';
import { articles } from '@/lib/site';
import { posts } from '@/lib/content';

export function HomeExperience() {
 const {t}=useLanguage();const root=useRef<HTMLDivElement>(null);
 const [motion,setMotion]=useState(false);
 useEffect(()=>{
  const preference=window.matchMedia('(prefers-reduced-motion: reduce)');
  const update=()=>setMotion(!preference.matches);update();
  preference.addEventListener('change',update);return()=>preference.removeEventListener('change',update);
 },[]);
 useEffect(()=>{
  const elements=Array.from(root.current?.querySelectorAll<HTMLElement>('[data-reveal]')||[]);
  if(!motion||!('IntersectionObserver' in window))return;
  const observer=new IntersectionObserver(items=>items.forEach(item=>{
   if(item.isIntersecting){item.target.classList.remove('reveal-pending');item.target.classList.add('reveal-arrived');observer.unobserve(item.target);}
  }),{threshold:.12});
  elements.forEach(element=>{if(element.getBoundingClientRect().top>window.innerHeight){element.classList.add('reveal-pending');observer.observe(element);}});
  const focus=(e:FocusEvent)=>{const element=(e.target as HTMLElement)?.closest('[data-reveal]');element?.classList.remove('reveal-pending');};
  document.addEventListener('focusin',focus);
  return()=>{observer.disconnect();elements.forEach(e=>e.classList.remove('reveal-pending'));document.removeEventListener('focusin',focus);};
 },[motion]);
 return <div ref={root} className="home-experience" data-motion={motion?'on':'off'}>
  <ReferenceHome/>
  <div className="home-capabilities"><div className="reference-container"><div className="capability-items">{[[Code2,'BUILD','නිර්මාණය'],[Search,'GROW','වර්ධනය'],[Workflow,'AUTOMATE','ස්වයංක්‍රීයකරණය'],[Package,'SUBSCRIBE','දායකත්ව']].map(([Icon,en,si],i)=>{const Symbol=Icon as typeof Code2;return <span key={i}><Symbol size={17}/>{t(en as string,si as string)}</span>;})}</div><button className="motion-control" onClick={()=>setMotion(!motion)} aria-pressed={!motion}>{motion?<Pause size={13}/>:<Play size={13}/>} {t(motion?'Pause motion':'Enable motion',motion?'චලන නවත්වන්න':'චලන සක්‍රිය කරන්න')}</button></div></div>

  <section className="home-section home-partner">
   <div className="reference-container partner-layout">
    <div className="partner-visual" data-reveal aria-hidden="true">
     <div className="visual-grid"/><div className="studio-window"><div className="window-chrome"><i/><i/><i/><span>SEO PLUS / DIGITAL STUDIO</span></div><div className="studio-screen"><div className="studio-sidebar"><span/><span/><span/><span/></div><div className="studio-dashboard"><div className="studio-dashboard-top"><div><small>YOUR NEXT CHAPTER</small><strong>Built to grow.</strong></div><span className="studio-status"><i/> CONNECTED</span></div><div className="studio-chart">{[26,43,35,57,46,69,61,82,74,94].map((h,i)=><span key={i} style={{height:`${h}%`}}/>)}</div><div className="studio-mini-panels"><span><Code2 size={18}/> WEB</span><span><Search size={18}/> SEO</span><span><Workflow size={18}/> FLOW</span></div></div></div></div><div className="studio-floating"><ShieldCheck size={24}/><span>{t('One connected team','එක්ව වැඩ කරන කණ්ඩායමක්')}<small>{t('Strategy → design → development','සැලැස්ම → නිර්මාණය → සංවර්ධනය')}</small></span></div><div className="studio-orbit"/><span className="studio-caption">{t('A connected approach to your digital presence.','ඔබේ ඩිජිටල් පැවැත්ම සඳහා ඒකාබද්ධ ප්‍රවේශයක්.')}</span>
    </div>
    <div className="home-section-copy" data-reveal><div className="home-eyebrow">{t('THE PEOPLE BEHIND THE PLUS','SEO PLUS පිටුපස අපි')}</div><h2>{t('Your ambition.','ඔබේ අරමුණ.')}<br/><span className="matched-gold">{t('Our next challenge.','අපේ ඊළඟ අභියෝගය.')}</span></h2><p>{t('A great website is only the beginning. We connect design, technology and digital strategy to help your business take its next step.','හොඳ වෙබ් අඩවියක් ආරම්භය පමණයි. ඔබේ ව්‍යාපාරයේ ඊළඟ පියවරට සහාය වීමට අපි නිර්මාණය, තාක්ෂණය සහ ඩිජිටල් උපායමාර්ග එක් කරමු.')}</p><div className="partner-values">{[['Designed for your business','ඔබේ ව්‍යාපාරයට ගැළපෙන නිර්මාණ'],['Clear communication, from start to launch','ආරම්භයේ සිට දියත් කිරීම දක්වා පැහැදිලි සන්නිවේදනය'],['Web, marketing and automation together','වෙබ්, අලෙවිකරණය සහ ස්වයංක්‍රීයකරණය එකම තැනක']].map(([en,si])=><span key={en}><Check size={17}/>{t(en,si)}</span>)}</div><Link className="home-text-link" href="/about">{t('Meet your digital partner','ඔබේ ඩිජිටල් සහකරු හඳුනාගන්න')}<ArrowUpRight size={20}/></Link></div>
   </div>
  </section>

  <section className="home-section home-pathways">
   <div className="reference-container">
    <div className="home-heading-row" data-reveal><div><div className="home-eyebrow">{t('BUILT AROUND YOUR GOALS','ඔබේ අරමුණු වටා ගොඩනැඟුණු')}</div><h2>{t('Where do you want','ඔබේ ඊළඟ පියවර')}<br/><span className="matched-gold">{t('to go next?','කුමක්ද?')}</span></h2></div><p>{t('Choose your starting point. We’ll help connect the right tools, ideas and expertise.','ඔබේ ආරම්භය තෝරන්න. ඊට ගැළපෙන මෙවලම්, අදහස් සහ දැනුම සම්බන්ධ කිරීමට අපි සහාය වෙමු.')}</p></div>
    <div className="pathway-grid">
     {[
      {icon:GlobeIcon,title:['Launch your business online','ඔබේ ව්‍යාපාරය අන්තර්ජාලයට ගෙන එන්න'],text:['Turn your first impression into a clear, memorable digital experience.','ඔබේ පළමු හැඟීම පැහැදිලි, මතකයේ රැඳෙන ඩිජිටල් අත්දැකීමක් බවට පත් කරන්න.'],tags:['WEBSITES','BRAND PRESENCE'],className:'launch'},
      {icon:Search,title:['Reach the right people','සුදුසු පිරිස වෙත ළඟා වන්න'],text:['Bring search, content and campaigns together around your customers.','ඔබේ පාරිභෝගිකයන් වටා සෙවුම්, අන්තර්ගතය සහ ප්‍රචාරණය එක් කරන්න.'],tags:['SEO','DIGITAL MARKETING'],className:'reach'},
      {icon:Workflow,title:['Make everyday work easier','දෛනික වැඩ පහසු කරගන්න'],text:['Connect your systems and simplify the tasks that take up your time.','ඔබේ පද්ධති සම්බන්ධ කර වැඩි කාලයක් ගන්නා කාර්යයන් සරල කරන්න.'],tags:['AUTOMATION','INTEGRATIONS'],className:'flow'},
     ].map((p,i)=><Link data-reveal className={`pathway-card pathway-${p.className}`} href="/solutions" key={p.className}><div className="pathway-art" aria-hidden="true"><div className="pathway-ring"/><p.icon size={48} strokeWidth={1.2}/><span className="pathway-node node-a"/><span className="pathway-node node-b"/><span className="pathway-node node-c"/></div><div className="pathway-body"><span className="pathway-index">0{i+1}</span><h3>{t(p.title[0],p.title[1])}</h3><p>{t(p.text[0],p.text[1])}</p><div className="pathway-bottom"><span>{p.tags.join(' / ')}</span><ArrowUpRight size={23}/></div></div></Link>)}
    </div>
   </div>
  </section>

  <section className="home-section home-store-section">
   <div className="reference-container store-feature" data-reveal>
    <div className="home-section-copy"><div className="home-eyebrow">{t('THE SEO PLUS SOFTWARE STORE','SEO PLUS මෘදුකාංග වෙළඳසැල')}</div><h2>{t('Your tools.','ඔබේ මෙවලම්.')}<br/><span className="matched-gold">{t('Your next advantage.','ඔබේ ඊළඟ ශක්තිය.')}</span></h2><p>{t('Discover software subscriptions for your digital life. Explore the store, choose your subscription and arrange your order directly with us on WhatsApp.','ඔබේ ඩිජිටල් ජීවිතය සඳහා මෘදුකාංග දායකත්ව සොයාගන්න. වෙළඳසැලෙන් ඔබේ දායකත්වය තෝරා WhatsApp හරහා අප සමඟ ඇණවුම සකස් කරගන්න.')}</p><Link className="button button-gold" href="/store">{t('Explore the Store','වෙළඳසැල බලන්න')}<ArrowRight size={19}/></Link><div className="store-feature-note"><MessageCircle size={16}/>{t('Personal assistance. Orders through WhatsApp.','පුද්ගලික සහාය. WhatsApp හරහා ඇණවුම්.')}</div></div>
    <div className="store-visual"><div className="store-orbit"/><div className="subscription-stack"><div className="stack-card stack-back"><Layers3 size={36}/></div><div className="stack-card stack-middle"><Code2 size={38}/></div><Link href="/store" className="stack-card stack-front"><div className="stack-top">SEO PLUS <span>STORE</span></div><div className="stack-symbol"><Package size={58} strokeWidth={1}/></div><strong>{t('Software','මෘදුකාංග')}<br/>{t('subscriptions.','දායකත්ව.')}</strong><div className="stack-bottom"><span>{t('Find your next tool','ඔබේ ඊළඟ මෙවලම සොයන්න')}</span><ArrowUpRight size={22}/></div></Link></div><span className="store-float-label"><Sparkles size={17}/>{t('A smarter way to work','වඩා සුහුරු වැඩ රටාවක්')}</span></div>
   </div>
  </section>

  <section className="home-section home-process">
   <div className="reference-container">
    <div className="home-heading-row" data-reveal><div><div className="home-eyebrow">{t('HOW WE WORK','අපි වැඩ කරන ආකාරය')}</div><h2>{t('From first hello','පළමු හමුවේ සිට')}<br/><span className="matched-gold">{t('to your next chapter.','ඔබේ ඊළඟ පියවර දක්වා.')}</span></h2></div><Link href="/contact" className="home-text-link">{t('Start a conversation','කතාබහක් අරඹන්න')}<ArrowUpRight size={20}/></Link></div>
    <div className="home-process-grid">{[
     ['Discover','හඳුනාගනිමු','We listen to your ideas, goals and challenges.','ඔබේ අදහස්, අරමුණු සහ අභියෝගවලට අපි සවන් දෙමු.'],
     ['Design','නිර්මාණය කරමු','We shape the structure, experience and visual direction.','අපි ව්‍යුහය, අත්දැකීම සහ දෘශ්‍ය සැලැස්ම සකස් කරමු.'],
     ['Develop','සංවර්ධනය කරමු','We build, connect and test your digital solution.','ඔබේ ඩිජිටල් විසඳුම ගොඩනඟා, සම්බන්ධ කර පරීක්ෂා කරමු.'],
     ['Launch','දියත් කරමු','We prepare your launch and discuss what comes next.','දියත් කිරීමට සූදානම් කර ඊළඟ පියවර ගැන සාකච්ඡා කරමු.'],
    ].map(([en,si,body,bodySi],i)=><article data-reveal key={en}><div className="process-step-top"><span>0{i+1}</span><ChevronRight size={20}/></div><h3>{t(en,si)}</h3><p>{t(body,bodySi)}</p></article>)}</div>
   </div>
  </section>

  <section className="home-section home-insights"><div className="reference-container">
   <div className="home-heading-row" data-reveal><div><div className="home-eyebrow">{t('IDEAS & INSIGHTS','අදහස් සහ දැනුම')}</div><h2>{t('A little inspiration.','අලුත් අදහසක්.')}<br/><span className="matched-gold">{t('A clearer next step.','පැහැදිලි ඊළඟ පියවරක්.')}</span></h2></div><Link href="/blog" className="home-text-link">{t('All insights','සියලු ලිපි')}<ArrowUpRight size={20}/></Link></div>
   <div className="home-insight-grid">{posts.map((p,i)=>{const Icon=[Code2,Search,Workflow][i];return <Link data-reveal className={`home-insight-card insight-${i}`} href={`/blog/${articles[i].slug}`} key={articles[i].slug}><div className="insight-cover"><span>SEO PLUS / {t('FIELD NOTES','සටහන්')}</span><Icon size={55} strokeWidth={1.1}/><div className="insight-decoration"/></div><div className="home-insight-body"><div className="home-eyebrow">{t(['WEB STRATEGY','SEARCH & CONTENT','BUSINESS AUTOMATION'][i],['වෙබ් උපායමාර්ග','සෙවුම් සහ අන්තර්ගතය','ව්‍යාපාර ස්වයංක්‍රීයකරණය'][i])}</div><h3>{t(p[0],p[1])}</h3><span className="home-text-link">{t('Read the insight','ලිපිය කියවන්න')}<ArrowUpRight size={18}/></span></div></Link>})}</div>
  </div></section>

  <section className="home-closing"><div className="reference-container" data-reveal><div className="closing-visual" aria-hidden="true"><div/><div/><div/></div><div className="home-eyebrow">{t('LET’S CREATE YOUR NEXT CHAPTER','ඔබේ ඊළඟ පියවර එක්ව ගොඩනඟමු')}</div><h2>{t('Big ideas start with','විශාල අදහස් ඇරඹෙන්නේ')}<br/><span className="matched-gold">{t('a simple hello.','සරල කතාබහකින්.')}</span></h2><p>{t('Tell us what you have in mind. Let’s make it happen.','ඔබේ සිතේ ඇති අදහස කියන්න. එය එක්ව සැබෑ කරමු.')}</p><a className="button button-gold" href={`https://wa.me/${site.whatsapp}?text=${encodeURIComponent(t('Hello SEO PLUS, I would like to discuss a project.','ආයුබෝවන් SEO PLUS, ව්‍යාපෘතියක් ගැන සාකච්ඡා කිරීමට අවශ්‍යයි.'))}`} target="_blank" rel="noopener noreferrer"><MessageCircle size={20}/>{t('Let’s talk on WhatsApp','WhatsApp හරහා කතා කරමු')}<ArrowRight size={18}/></a></div></section>
 </div>;
}
function GlobeIcon({size=48,strokeWidth=1.2}:{size?:number;strokeWidth?:number}){return <MousePointer2 size={size} strokeWidth={strokeWidth}/>;}
