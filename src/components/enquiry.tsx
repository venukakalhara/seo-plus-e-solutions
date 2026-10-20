'use client';
import { useState, type FormEvent } from 'react';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from './language';
import { services } from '@/lib/content';
import { site } from '@/lib/site';
const enquiryServices = [...services, { en: 'Software subscription', si: 'මෘදුකාංග දායකත්වය' }];

export function Enquiry() {
 const {t}=useLanguage(); const [draft,setDraft]=useState('');
 function submit(e:FormEvent<HTMLFormElement>){e.preventDefault(); const data=new FormData(e.currentTarget);setDraft(`${t('Project enquiry','ව්‍යාපෘති විමසීම')} — SEO PLUS\n${t('Name','නම')}: ${data.get('name')}\n${t('Email','ඊමේල්')}: ${data.get('email')}\n${t('Service','සේවාව')}: ${data.get('service')}\n\n${data.get('message')}`);}
 return <form className="contact-form" onSubmit={submit}><label>{t('Your name','ඔබේ නම')}<input name="name" autoComplete="name" required maxLength={100}/></label><label>{t('Email address','ඊමේල් ලිපිනය')}<input name="email" type="email" autoComplete="email" required maxLength={254}/></label><label>{t('Service','අවශ්‍ය සේවාව')}<select name="service" defaultValue="" required><option value="" disabled>{t('Select a service','සේවාවක් තෝරන්න')}</option>{enquiryServices.map(s=><option key={s.en} value={s.en}>{t(s.en,s.si)}</option>)}<option value="Other">{t('Help me decide','තෝරා ගැනීමට සහාය අවශ්‍යයි')}</option></select></label><label>{t('Tell us about your project','ඔබේ ව්‍යාපෘතිය ගැන කියන්න')}<textarea name="message" rows={5} required minLength={15} maxLength={4000}/></label><p className="form-note">{t('Prepare your message, then send it through WhatsApp. This form does not send automatically.','පණිවිඩය සකස් කර WhatsApp හරහා යවන්න. මෙම පෝරමය ස්වයංක්‍රීයව පණිවිඩ යවන්නේ නැත.')}</p><button className="button button-gold" type="submit">{t('Prepare enquiry','විමසීම සකස් කරන්න')}<ArrowRight size={18}/></button>{draft && <div className="enquiry-result" role="status"><h3>{t('Your message is ready to send.','ඔබේ පණිවිඩය යැවීමට සූදානම්.')}</h3><textarea aria-label={t('Prepared message','සකස් කළ පණිවිඩය')} value={draft} readOnly rows={7}/><a className="button button-gold" target="_blank" rel="noopener noreferrer" href={`https://wa.me/${site.whatsapp}?text=${encodeURIComponent(draft)}`}>{t('Open WhatsApp','WhatsApp විවෘත කරන්න')}<ArrowRight size={18}/></a></div>}</form>;
}
