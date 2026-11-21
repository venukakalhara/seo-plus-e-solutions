import { pageMetadata } from '@/lib/metadata';
import { Website } from '@/components/website';
import { records } from '@/lib/database';
import type { Entry } from '@/lib/store-types';
export const generateMetadata=()=>pageMetadata('/projects');
export const dynamic='force-dynamic';
export const runtime='nodejs';
export default function Page(){return <Website page="projects" entries={records<Entry>('entry').filter(e=>e.kind==='project'&&e.published)}/>;}
