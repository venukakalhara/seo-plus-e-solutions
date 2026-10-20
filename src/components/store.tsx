'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Search, Package, ArrowRight, MessageCircle, Clock } from 'lucide-react';
import { Header, Footer } from './chrome';
import { useLanguage } from './language';
import { site } from '@/lib/site';
import type { Product } from '@/lib/store-types';

export function Store({ products }: { products: Product[] }) {
  const { t } = useLanguage();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [availableOnly, setAvailableOnly] = useState(false);
  const categories = [...new Set(products.map(p => p.category))].sort();
  const visible = useMemo(() => products.filter(p =>
    (!category || p.category === category) && (!availableOnly || p.available) &&
    `${p.title} ${p.titleSi} ${p.description} ${p.descriptionSi}`.toLowerCase().includes(search.toLowerCase().trim())
  ), [products, category, availableOnly, search]);
  return <><Header/><main id="main">
    <section className="container page-heading store-heading"><div className="eyebrow">SEO PLUS / {t('SOFTWARE STORE', 'මෘදුකාංග වෙළඳසැල')}</div>
      <h1>{t('Your next digital upgrade.', 'ඔබේ ඊළඟ ඩිජිටල් පියවර.')}<br/><span className="gold-text">{t('Software subscriptions.', 'මෘදුකාංග දායකත්වයන්.')}</span></h1>
      <p>{t('Explore subscriptions, choose your plan and contact us on WhatsApp to arrange payment and delivery.', 'දායකත්වයන් බලන්න, ඔබට සුදුසු සැලැස්ම තෝරා ගෙවීම සහ ලබාදීම සකස් කිරීමට WhatsApp හරහා අප අමතන්න.')}</p>
      <div className="store-steps">{[[Package,'Choose a subscription','දායකත්වයක් තෝරන්න'],[MessageCircle,'Order on WhatsApp','WhatsApp හරහා ඇණවුම් කරන්න'],[CheckIcon,'Arrange activation','සක්‍රිය කිරීම සකස් කරගන්න']].map(([Icon,en,si],i)=>{const Component=Icon as typeof Package;return <span key={i}><Component size={18}/>{t(en as string,si as string)}</span>})}</div>
    </section>
    <section className="container page-content">
      <div className="store-filters"><label className="store-search"><Search size={18}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder={t('Search subscriptions…','දායකත්ව සොයන්න…')} aria-label={t('Search subscriptions','දායකත්ව සොයන්න')}/></label><select aria-label={t('Category','කාණ්ඩය')} value={category} onChange={e=>setCategory(e.target.value)}><option value="">{t('All categories','සියලු කාණ්ඩ')}</option>{categories.map(c=><option key={c}>{c}</option>)}</select><label className="check-label"><input type="checkbox" checked={availableOnly} onChange={e=>setAvailableOnly(e.target.checked)}/>{t('Available only','ලබාගත හැකි ඒවා පමණි')}</label></div>
      {visible.length ? <div className="store-grid">{visible.map(p=><article className="subscription-card" key={p.id}><div className="subscription-art"><Package size={50} strokeWidth={1}/><span>{p.category}</span><span className={`stock-badge ${p.available?'in-stock':'sold-out'}`}>{t(p.available?'Available':'Sold out',p.available?'ලබාගත හැකිය':'දැනට අවසන්')}</span></div><div className="subscription-copy"><h2>{t(p.title,p.titleSi)}</h2><p>{t(p.description,p.descriptionSi)}</p><div className="subscription-duration"><Clock size={16}/>{t(p.duration,p.durationSi)}</div><strong className="subscription-price">LKR {p.price.toLocaleString('en-LK',{minimumFractionDigits:2,maximumFractionDigits:2})}</strong>{p.available?<a className="button button-gold" href={`https://wa.me/${site.whatsapp}?text=${encodeURIComponent(t(`Hello SEO PLUS, I would like to order:\n${p.title}\nSubscription: ${p.duration}\nListed price: LKR ${p.price.toFixed(2)}\nProduct reference: ${p.id}\nPlease confirm availability, payment and activation details.`,`ආයුබෝවන් SEO PLUS, මට පහත දායකත්වය ඇණවුම් කිරීමට අවශ්‍යයි:\n${p.titleSi}\nකාලසීමාව: ${p.durationSi}\nදක්වා ඇති මිල: LKR ${p.price.toFixed(2)}\nයොමුව: ${p.id}\nලබාගත හැකි බව, ගෙවීම සහ සක්‍රිය කිරීමේ විස්තර තහවුරු කරන්න.`))}`} target="_blank" rel="noopener noreferrer"><MessageCircle size={18}/>{t('Order on WhatsApp','WhatsApp ඇණවුම')}</a>:<button className="button button-outline" disabled>{t('Currently sold out','දැනට අවසන්')}</button>}</div></article>)}</div>:<div className="store-empty"><Package size={48} strokeWidth={1}/><h2>{t(products.length?'No matching subscriptions.':'Subscriptions coming soon.',products.length?'ගැළපෙන දායකත්ව හමු නොවීය.':'දායකත්ව ඉක්මනින් එක් කෙරේ.')}</h2><p>{t(products.length?'Try another search or category.':'Contact us to discuss the subscription you need.',products.length?'වෙනත් සෙවුමක් හෝ කාණ්ඩයක් තෝරන්න.':'ඔබට අවශ්‍ය දායකත්වය ගැන අපෙන් විමසන්න.')}</p>{products.length?<button className="button button-outline" onClick={()=>{setSearch('');setCategory('');setAvailableOnly(false)}}>{t('Clear filters','පෙරහන් ඉවත් කරන්න')}</button>:<Link href="/contact" className="button button-gold">{t('Ask about a subscription','දායකත්වයක් ගැන විමසන්න')}<ArrowRight size={18}/></Link>}</div>}
    </section></main><Footer/></>;
}
function CheckIcon({size=18}:{size?:number}) { return <ArrowRight size={size}/>; }
