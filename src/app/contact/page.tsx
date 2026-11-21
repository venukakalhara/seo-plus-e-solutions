import { pageMetadata } from '@/lib/metadata';
﻿import { Website } from '@/components/website';
export const generateMetadata=()=>pageMetadata('/contact');
export default function Page() { return <Website page="contact"/>; }
