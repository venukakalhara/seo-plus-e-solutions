import { pageMetadata } from '@/lib/metadata';
﻿import { PrivacyContent } from '@/components/privacy-content';
export const generateMetadata=()=>pageMetadata('/privacy');
export default function Privacy() { return <PrivacyContent/>; }
