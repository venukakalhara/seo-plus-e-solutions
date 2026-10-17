'use client';

import Link from 'next/link';

import { useEffect, useRef, useState, type FormEvent, type CSSProperties } from 'react';
import { ArrowUpRight, Menu, X, MessageCircle, Check, Copy, Search, Code2, Zap } from 'lucide-react';
import { site } from '@/lib/site';

export function Navigation() {
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => { if (event.key === 'Escape') { setOpen(false); toggle.current?.focus(); } };
    document.addEventListener('keydown', close);
    return () => document.removeEventListener('keydown', close);
  }, [open]);
  return <><button ref={toggle} className="menu-toggle" aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} aria-controls="navigation" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button><nav id="navigation" aria-label="Main navigation" className={open ? 'navigation is-open' : 'navigation'}>{['Services', 'About', 'Solutions', 'Projects', 'Blog'].map(n => <a key={n} href={`/#${n.toLowerCase()}`} onClick={() => setOpen(false)}>{n}</a>)}<Link className="nav-cta" href="/#contact" onClick={() => setOpen(false)}>Get a quote <ArrowUpRight size={15} /></Link></nav></>;
}

const focuses = [
  { name: 'Build', icon: Code2, label: 'Crafted for your next chapter', detail: 'Web experiences with purpose.' },
  { name: 'Grow', icon: Search, label: 'Make your presence matter', detail: 'Search. Content. Connection.' },
  { name: 'Connect', icon: Zap, label: 'Make the complex feel simple', detail: 'Smarter digital workflows.' },
];
export function HeroVisual() {
  const [active, setActive] = useState(0);
  const visual = useRef<HTMLDivElement>(null);
  const current = focuses[active];
  return <div className="hero-art" ref={visual} onPointerMove={e => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || e.pointerType === 'touch') return;
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--rx', `${(e.clientY - rect.top - rect.height / 2) / -55}deg`);
    e.currentTarget.style.setProperty('--ry', `${(e.clientX - rect.left - rect.width / 2) / 55}deg`);
  }} onPointerLeave={() => { visual.current?.style.setProperty('--rx', '0deg'); visual.current?.style.setProperty('--ry', '0deg'); }}>
    <div className="art-grid" aria-hidden="true" /><div className="orbital-scene" aria-hidden="true"><div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="orbit orbit-three"/><div className="sphere"><div className="sphere-grid"/><ArrowUpRight className="growth-arrow" strokeWidth={1.2}/></div><div className="orbit-point point-one"/><div className="orbit-point point-two"/></div>
    <div className="art-label label-top"><span className="status-dot"/> IDEAS INTO IMPACT</div>
    <div className="floating-note note-code"><Code2 size={18}/><span>Built with purpose<small>Designed around you</small></span></div>
    <div className="floating-note note-growth"><span className="mini-bars" aria-hidden="true">{[22,35,29,44,58].map((h,i) => <i key={i} style={{height: h}}/>)}</span><span>A brighter trajectory<small>Start with the right strategy</small></span></div>
    <div className="art-bottom"><div className="focus-switch" aria-label="Explore our focus">{focuses.map((f,i) => <button key={f.name} onClick={() => setActive(i)} aria-pressed={active === i}><f.icon size={14}/>{f.name}</button>)}</div><div className="focus-caption" aria-live="polite"><strong>{current.label}</strong><span>{current.detail}</span></div></div>
  </div>;
}

const projects = [
  { name: 'A new perspective on commerce.', type: 'Web experiences', tag: 'E-COMMERCE CONCEPT', theme: 'commerce', brand: 'FORMA', line: 'Objects for a considered life.' },
  { name: 'Your business. In focus.', type: 'Digital platforms', tag: 'DASHBOARD CONCEPT', theme: 'dashboard', brand: 'Overview', line: 'A clearer view of your everyday.' },
  { name: 'A destination worth discovering.', type: 'Web experiences', tag: 'HOSPITALITY CONCEPT', theme: 'travel', brand: 'AURA', line: 'Somewhere beyond the ordinary.' },
];
export function Projects() {
  const [filter, setFilter] = useState('All work');
  return <><div className="project-filters" aria-label="Filter concept projects">{['All work','Web experiences','Digital platforms'].map(f => <button key={f} aria-pressed={filter === f} onClick={() => setFilter(f)}>{f}</button>)}</div><div className="projects-grid">{projects.filter(p => filter === 'All work' || p.type === filter).map(p => <article key={p.name} className="project"><div className={`project-preview ${p.theme}`}><div className="preview-top"><span>{p.brand}</span><span>↗</span></div><div className="preview-content"><small>ILLUSTRATIVE DESIGN</small><strong>{p.line}</strong>{p.theme === 'dashboard' ? <div className="chart" aria-hidden="true">{[35,52,43,70,60,85,74,95].map((v,i)=><i key={i} style={{'--bar':`${v}%`} as CSSProperties}/>)}</div> : <div className="abstract-object" aria-hidden="true"/>}</div><span className="concept-badge">Concept preview</span></div><div className="project-caption"><div><span className="eyebrow">{p.tag}</span><h3>{p.name}</h3></div><ArrowUpRight size={22} aria-hidden="true"/></div><details><summary>Explore the concept</summary><p>An illustrative {p.type.toLowerCase()} direction showing a possible approach to layout, content and interaction. This is not a completed client project or a performance claim.</p><a href="#contact" className="text-link">Discuss a similar idea <ArrowUpRight size={15}/></a></details></article>)}</div></>;
}

export function ContactForm() {
  const [draft, setDraft] = useState('');
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setDraft(`SEO PLUS project enquiry\n\nName: ${data.get('name')}\nEmail: ${data.get('email')}\nService: ${data.get('service')}\n\n${data.get('message')}`);
    setCopied(false); setCopyError(false);
  }
  return <form className="contact-form" onSubmit={submit}><div className="form-row"><label>Your name<input name="name" autoComplete="name" placeholder="How should we call you?" required maxLength={100}/></label><label>Email address<input name="email" type="email" autoComplete="email" placeholder="you@company.com" required maxLength={254}/></label></div><label>What can we help with?<select name="service" defaultValue="" required><option value="" disabled>Select a service</option><option>Website design &amp; development</option><option>SEO &amp; digital marketing</option><option>Business automation</option><option>Custom digital solution</option><option>Help me decide</option></select></label><label>A little about your idea<textarea name="message" placeholder="Your goals, your challenges, your next big idea…" rows={4} required minLength={15} maxLength={4000}/></label><p className="form-note">Prepare an enquiry locally. Nothing is stored or sent automatically.{!site.email && !site.whatsapp && ' Direct contact details are awaiting confirmation.'}</p><button className="button button-gold" type="submit">Prepare my enquiry <ArrowUpRight size={18}/></button>{draft && <div className="enquiry-result" role="status"><h3>Your enquiry is ready — not sent yet.</h3><textarea aria-label="Prepared enquiry" readOnly value={draft} rows={8}/><div className="draft-actions"><button type="button" className="button button-outline" onClick={async () => {try {await navigator.clipboard.writeText(draft);setCopied(true);}catch {setCopyError(true);}}}>{copied ? <Check size={16}/> : <Copy size={16}/>} {copied ? 'Copied' : 'Copy enquiry'}</button>{site.email && <a className="text-link" href={`mailto:${site.email}?subject=SEO%20PLUS%20project%20enquiry&body=${encodeURIComponent(draft)}`}>Open email <ArrowUpRight size={15}/></a>}{site.whatsapp && <a className="text-link" href={`https://wa.me/${site.whatsapp}?text=${encodeURIComponent(draft)}`} target="_blank" rel="noopener noreferrer">Open WhatsApp <ArrowUpRight size={15}/></a>}</div>{copyError && <p>Select and copy the enquiry text above; clipboard access is unavailable.</p>}</div>}</form>;
}

export function WhatsAppButton() {
  const [open,setOpen] = useState(false);
  return <div className="whatsapp-container">{open && <div className="whatsapp-popover" role="status"><strong>Let’s start a conversation.</strong><p>Our WhatsApp number is awaiting confirmation. You can prepare a project enquiry below.</p><Link href="/#contact" className="text-link" onClick={() => setOpen(false)}>Plan your project <ArrowUpRight size={14}/></Link></div>}{site.whatsapp ? <a className="whatsapp" href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noopener noreferrer" aria-label="Chat with SEO PLUS on WhatsApp"><MessageCircle size={23}/></a> : <button className="whatsapp" onClick={() => setOpen(!open)} aria-label="WhatsApp contact information" aria-expanded={open}><MessageCircle size={23}/></button>}</div>;
}
