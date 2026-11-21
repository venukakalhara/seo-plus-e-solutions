import { pageMetadata } from '@/lib/metadata';
﻿import { Website } from '@/components/website';
export const generateMetadata=()=>pageMetadata('/about');
export default function Page() { return <Website page="about"/>; }
