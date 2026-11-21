'use client';
import { useState, type FormEvent } from 'react';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from './language';
import { services } from '@/lib/content';
import { site } from '@/lib/site';
const enquiryServices = [...services, { en: 'Software subscription', si: 'මෘදුකාංග දායකත්වය' }];

export function Enquiry() {
 const {t}=useLanguage(); const [draft,setDraft]=useState(''); const [busy,setBusy]=useState(false); const [error,setError]=useState('');
 async function submit(e:FormEvent<HTMLFormElement>){
  e.preventDefault(); if(busy)return; setBusy(true);setError('');
  const form=e.currentTarget;const data=Object.fromEntries(new FormData(form));
  try{const response=await fetch('/api/enquiries',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});const result=await response.json();if(!response.ok)throw new Error(result.error);setDraft(result.reference);form.reset();}
  catch(error){setError(error instanceof Error?error.message:'Could not send. Please try again.');}finally{setBusy(false);}
 }
 return <form className="contact-form" onSubmit={submit}><label>{t('Your name','ඔබේ නම')}<input name="name" autoComplete="name" required maxLength={100}/></label><label>{t('Email address','ඊමේල් ලිපිනය')}<input name="email" type="email" autoComplete="email" required maxLength={254}/></label><label>{t('Service','අවශ්‍ය සේවාව')}<select name="service" defaultValue="" required><option value="" disabled>{t('Select a service','සේවාවක් තෝරන්න')}</option>{enquiryServices.map(s=><option key={s.en} value={s.en}>{t(s.en,s.si)}</option>)}<option value="Other">{t('Help me decide','තෝරා ගැනීමට සහාය අවශ්‍යයි')}</option></select></label><label>{t('Tell us about your project','ඔබේ ව්‍යාපෘතිය ගැන කියන්න')}<textarea name="message" rows={5} required minLength={15} maxLength={4000}/></label><label className="form-trap" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off"/></label><p className="form-note">{t('Your enquiry is saved for our team. We use your details to respond to your request.','ඔබේ විමසීම අප කණ්ඩායමට සුරැකේ. ප්‍රතිචාර දැක්වීමට ඔබේ විස්තර භාවිත කරමු.')}</p><button className="button button-gold" type="submit" disabled={busy}>{t(busy?'Sending…':'Send enquiry',busy?'යවමින්…':'විමසීම යවන්න')}<ArrowRight size={18}/></button>{error&&<p role="alert">{error} <a href={`https://wa.me/${site.whatsapp}`}>WhatsApp</a></p>}{draft&&<div className="enquiry-result" role="status"><h3>{t('Enquiry received. Thank you!','විමසීම ලැබුණා. ස්තුතියි!')}</h3><p>{t('Reference','යොමුව')}: {draft}</p><p>{t('Our team will review your message and contact you by email.','අප කණ්ඩායම ඔබේ පණිවිඩය සමාලෝචනය කර ඊමේල් හරහා ඔබ අමතනු ඇත.')}</p></div>}</form>;
}
