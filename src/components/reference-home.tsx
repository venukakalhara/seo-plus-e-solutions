'use client';

import Image from 'next/image';
import Link from './localized-link';
import { useEffect, useRef, useState } from 'react';
import { ArrowRight, ChartNoAxesCombined, Code2, Globe, Megaphone, Search, Settings, CirclePlay, X, Pause, Play } from 'lucide-react';
import { useLanguage } from './language';
import { Stats } from './stats';
import { HeroMotion } from './hero-motion';

const services = [
  {icon:Globe,name:['Web Development','වෙබ් අඩවි නිර්මාණය'],text:['Modern, high-performance websites tailored to your business needs.','ඔබේ ව්‍යාපාරයේ අවශ්‍යතාවන්ට ගැළපෙන නවීන, කාර්යක්ෂම වෙබ් අඩවි.']},
  {icon:ChartNoAxesCombined,name:['Digital Marketing','ඩිජිටල් අලෙවිකරණය'],text:['Data-driven strategies to increase your brand visibility and customers.','ඔබේ සන්නාමයේ දෘශ්‍යතාව සහ පාරිභෝගික පිරිස වැඩි කිරීමට දත්ත මත පදනම් වූ උපායමාර්ග.']},
  {icon:Settings,name:['Business Automation','ව්‍යාපාර ස්වයංක්‍රීයකරණය'],text:['Streamline your operations with smart automation solutions.','සුහුරු ස්වයංක්‍රීය විසඳුම් සමඟ ඔබේ මෙහෙයුම් කාර්යක්ෂම කරන්න.']},
  {icon:Search,name:['SEO Solutions','SEO විසඳුම්'],text:['Improve your search rankings and drive organic growth.','ඔබේ සෙවුම් ස්ථාන දියුණු කර ස්වාභාවික වර්ධනයක් ඇති කරන්න.']},
];

export function ReferenceHome({motion=false,onToggleMotion}:{motion?:boolean;onToggleMotion?:()=>void}) {
 const {t}=useLanguage();
 return <div className="reference-home">
  <section className="matched-hero">
   <Image className="matched-hero-art" src="/hero-reference-v2.png" alt="" fill priority sizes="100vw"/>
   <HeroMotion enabled={motion}/>
   <div className="matched-hero-shade"/>
   <div className="reference-container matched-hero-inner">
    <div className="matched-hero-copy">
     <div className="matched-kicker"><span>{t('IT SOLUTIONS','IT විසඳුම්')}</span><i>•</i><span>{t('DIGITAL GROWTH','ඩිජිටල් වර්ධනය')}</span><i>•</i><span>{t('BUSINESS AUTOMATION','ව්‍යාපාර ස්වයංක්‍රීයකරණය')}</span></div>
     <h1><span>{t('Innovative','නවෝත්පාදන')}</span><span className="matched-gold">{t('Digital Solutions','ඩිජිටල් විසඳුම්')}</span><span className="hero-final-line">{t('for a Smarter Tomorrow','සුහුරු හෙට දවසක් සඳහා')}</span></h1>
     <p>{t('At SEO PLUS, we combine technology, creativity and strategy','SEO PLUS හි අපි තාක්ෂණය, නිර්මාණශීලීත්වය සහ උපායමාර්ග එක් කර')}<br className="hero-paragraph-break"/>{t('to help businesses grow, automate and succeed in the digital world.','ව්‍යාපාර ඩිජිටල් ලෝකයේ වර්ධනය කිරීමට, ස්වයංක්‍රීය කිරීමට සහ සාර්ථක වීමට සහාය වෙමු.')}</p>
     <div className="matched-actions"><Link className="button button-gold" href="/services">{t('Our Services','අපගේ සේවා')}<ArrowRight size={19}/></Link><Intro/></div>
     <Stats motion={motion}/>
    </div>
    <div className="hero-labels" aria-label={t('Our expertise','අපගේ විශේෂඥතාව')}>
     <Link href="/solutions" className="expertise-badge badge-growth"><ChartNoAxesCombined/><span>{t('Business','ව්‍යාපාර')}<br/>{t('Growth','වර්ධනය')}</span></Link>
     <Link href="/services" className="expertise-badge badge-marketing"><Megaphone/><span>{t('Digital','ඩිජිටල්')}<br/>{t('Marketing','අලෙවිකරණය')}</span></Link>
     <Link href="/services" className="expertise-badge badge-web"><Code2/><span>{t('Web','වෙබ්')}<br/>{t('Development','සංවර්ධනය')}</span></Link>
     <Link href="/solutions" className="expertise-badge badge-automation"><Settings/><span>{t('Automation','ස්වයංක්‍රීය')}<br/>{t('Solutions','විසඳුම්')}</span></Link>
    </div>
   </div>
   {onToggleMotion&&<button className="hero-motion-toggle" onClick={onToggleMotion} aria-pressed={!motion}>{motion?<Pause size={13}/>:<Play size={13}/>} {t(motion?'Pause animation':'Play animation',motion?'චලනය නවත්වන්න':'චලනය අරඹන්න')}</button>}
  </section>
  <section className="matched-services">
   <div className="reference-container">
    <div className="matched-services-heading" data-reveal><div className="section-label"><span/>{t('OUR SERVICES','අපගේ සේවා')}<span/></div><h2>{t('Comprehensive','පුළුල්')} <span className="matched-gold">{t('IT & Digital Solutions','IT සහ ඩිජිටල් විසඳුම්')}</span></h2><p>{t('From web development to digital marketing, we provide end-to-end solutions','වෙබ් සංවර්ධනයේ සිට ඩිජිටල් අලෙවිකරණය දක්වා, අපි සම්පූර්ණ විසඳුම් සපයමු')}<br/>{t('to help your business grow in the digital era.','ඩිජිටල් යුගයේ ඔබේ ව්‍යාපාරය වර්ධනය කිරීමට.')}</p></div>
    <div className="matched-service-grid">{services.map((s,i)=><Link data-reveal href="/services" key={s.name[0]} className={`matched-service-card matched-service-${i}`}><div className="matched-service-icon"><s.icon size={35} strokeWidth={1.8}/></div><h3>{t(s.name[0],s.name[1])}</h3><p>{t(s.text[0],s.text[1])}</p><ArrowRight className="service-arrow" size={22}/></Link>)}</div>
   </div>
  </section>
 </div>;
}

function Intro() {
 const {t}=useLanguage();
 const dialog=useRef<HTMLDialogElement>(null);
 const video=useRef<HTMLVideoElement>(null);
 const [open,setOpen]=useState(false);
 useEffect(()=>{if(!open)return;const previous=document.body.style.overflow;document.body.style.overflow='hidden';return()=>{document.body.style.overflow=previous;};},[open]);
 function close(){video.current?.pause();setOpen(false);}
 return <><button className="button matched-intro-button" onClick={()=>{dialog.current?.showModal();setOpen(true);if(video.current){video.current.currentTime=0;void video.current.play().catch(()=>{});}}}><CirclePlay size={22}/>{t('Watch Intro','හැඳින්වීම බලන්න')}</button>
 <dialog ref={dialog} className="intro-dialog film-dialog" onClose={close} onClick={e=>{if(e.target===dialog.current)dialog.current.close();}} aria-labelledby="intro-title">
 <div className="film-heading"><h2 id="intro-title">SEO PLUS · {t('Our story','අපේ කතාව')}</h2><button aria-label={t('Close introduction','හැඳින්වීම වසන්න')} onClick={()=>dialog.current?.close()}><X/></button></div>
 <video ref={video} controls playsInline preload="none" poster="/media/intro-poster.jpg" aria-label="SEO PLUS vision, mission and services introduction"><source src="/media/seo-plus-intro.mp4" type="video/mp4"/>Your browser does not support video. <a href="/media/seo-plus-intro.mp4">Download the introduction</a>.</video>
 <div className="film-footer"><span>{t('Our vision. Your next chapter.','අපගේ දැක්ම. ඔබේ නව ඇරඹුම.')}</span><Link href="/contact" onClick={()=>dialog.current?.close()}>{t('Let’s build together','එක්ව ගොඩනඟමු')}</Link></div>
 </dialog></>;
}
