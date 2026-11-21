 'use client';
import { createContext, useContext } from 'react';
import { usePathname } from 'next/navigation';
type Language='en'|'si';
const LanguageContext=createContext<Language>('en');
export function LanguageProvider({children,language='en'}:{children:React.ReactNode;language?:Language}){return <LanguageContext.Provider value={language}>{children}</LanguageContext.Provider>;}
export function useLanguage(){const language=useContext(LanguageContext);return {language,t:(en:string,si:string)=>language==='si'?si:en};}
export function LanguageSwitch() {
  const { language } = useLanguage(); const pathname=usePathname(); const path=pathname.replace(/^\/si(?=\/|$)/,'')||'/';
  return <div className="language-switch" role="group" aria-label="Language / භාෂාව">
    <a href={path} lang="en" aria-current={language==='en'?'page':undefined}>English</a>
    <a href={`/si${path==='/'?'':path}`} lang="si" aria-current={language==='si'?'page':undefined}>සිංහල</a>
  </div>;
}
