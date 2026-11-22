'use client';
import { useId, useRef, useState } from 'react';
import { getCountries, getCountryCallingCode, type CountryCode } from 'libphonenumber-js/max';
import * as flags from 'country-flag-icons/react/3x2';
import { normalizeMobile } from '@/lib/phone';
import { useLanguage } from './language';

const names=new Intl.DisplayNames(['en'],{type:'region'});
const countries=getCountries().sort((a,b)=>(names.of(a)||a).localeCompare(names.of(b)||b));
export function MobileField(){
 const {t}=useLanguage();const id=useId();const menu=useRef<HTMLDetailsElement>(null);const input=useRef<HTMLInputElement>(null);
 const [country,setCountry]=useState<CountryCode>('LK');const [search,setSearch]=useState('');const [error,setError]=useState('');
 const Flag=flags[country];
 function validate(value:string,next=country){try{normalizeMobile(value,next);setError('');input.current?.setCustomValidity('');}catch{const message=t('Enter a valid mobile number for the selected country.','තෝරාගත් රටට ගැළපෙන ජංගම දුරකථන අංකයක් ඇතුළත් කරන්න.');setError(message);input.current?.setCustomValidity(message);}}
 return <fieldset className="phone-field"><legend>{t('Mobile number (required)','ජංගම දුරකථන අංකය (අනිවාර්යයි)')}</legend><input type="hidden" name="phoneCountry" value={country}/>
  <div className="phone-controls"><details ref={menu} className="phone-country" onKeyDown={e=>{if(e.key==='Escape'){menu.current?.removeAttribute('open');menu.current?.querySelector('summary')?.focus();}}}>
   <summary aria-label={t('Choose country and calling code','රට සහ දුරකථන කේතය තෝරන්න')}>{Flag&&<Flag aria-hidden="true"/>}<span>{country} +{getCountryCallingCode(country)}</span><span aria-hidden="true">⌄</span></summary>
   <div className="phone-country-menu"><input type="search" value={search} onChange={e=>setSearch(e.target.value)} placeholder={t('Search country or code','රට හෝ කේතය සොයන්න')} aria-label={t('Search countries','රට සොයන්න')}/><div className="phone-country-options">
   {countries.filter(c=>`${names.of(c)} ${c} +${getCountryCallingCode(c)}`.toLowerCase().includes(search.toLowerCase())).map(c=>{const CountryFlag=flags[c];return <button key={c} type="button" aria-pressed={c===country} onClick={()=>{setCountry(c);setSearch('');menu.current?.removeAttribute('open');validate(input.current?.value||'',c);input.current?.focus();}}>{CountryFlag&&<CountryFlag aria-hidden="true"/>}<span>{names.of(c)}</span><span>+{getCountryCallingCode(c)}</span></button>;})}</div></div>
  </details><label className="phone-number-label" htmlFor={id}>{t('Mobile number','ජංගම අංකය')}<input ref={input} id={id} name="phone" required type="tel" inputMode="tel" autoComplete="tel-national" maxLength={40} placeholder={country==='LK'?'077 123 4567':t('Your mobile number','ඔබේ ජංගම අංකය')} aria-invalid={Boolean(error)} aria-describedby={`${id}-hint ${id}-error`} onBlur={e=>validate(e.target.value)} onChange={e=>validate(e.target.value)}/></label></div>
  <p id={`${id}-hint`} className="phone-hint">{t('Select your country, then enter your mobile number.','රට තෝරා ඔබේ ජංගම දුරකථන අංකය ඇතුළත් කරන්න.')}</p><p id={`${id}-error`} className="phone-error" aria-live="polite">{error}</p>
 </fieldset>;
}
