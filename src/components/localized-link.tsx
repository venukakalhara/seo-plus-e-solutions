'use client';
import NextLink from 'next/link';
import type { ComponentProps } from 'react';
import { useLanguage } from './language';
export default function Link({href,...props}:ComponentProps<typeof NextLink>){
 const {language}=useLanguage();
 const localized=typeof href==='string'&&href.startsWith('/')&&!href.startsWith('//')&&!href.startsWith('/si')&&!href.startsWith('/admin')&&language==='si'?`/si${href==='/'?'':href}`:href;
 return <NextLink href={localized} {...props}/>;
}
