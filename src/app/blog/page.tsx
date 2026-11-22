import { StorageUnavailable } from '@/components/storage-unavailable';
import { StorageUnavailableError } from '@/lib/storage-error';
import { pageMetadata } from '@/lib/metadata';
import { Website } from '@/components/website';
import { records } from '@/lib/database';
import type { Entry } from '@/lib/store-types';
export const generateMetadata=()=>pageMetadata('/blog');
export const dynamic='force-dynamic';
export const runtime='nodejs';
export default async function Page() {
 let items:Entry[];
 try { items=await records<Entry>('entry'); } catch(error) {if(error instanceof StorageUnavailableError)return <StorageUnavailable/>;throw error;}
 return <Website page="blog" entries={items.filter(e=>e.kind==='blog'&&e.published)}/>;
}
