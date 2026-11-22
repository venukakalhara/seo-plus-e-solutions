import { StorageUnavailable } from '@/components/storage-unavailable';
import { StorageUnavailableError } from '@/lib/storage-error';
import { pageMetadata } from '@/lib/metadata';
import { notFound } from 'next/navigation';
import { record } from '@/lib/database';
import type { Entry } from '@/lib/store-types';
import { PublishedEntry } from '@/components/published-content';
export const dynamic='force-dynamic';
export const runtime='nodejs';
export async function generateMetadata({params}:{params:Promise<{id:string}>}) {
 try { const {id}=await params;const entry=await record<Entry>('entry',id);
 return entry?.published?await pageMetadata(`/updates/${id}`,entry.title,entry.summary,entry.titleSi,entry.summarySi):{title:'Not found'}; } catch(error) { if(error instanceof StorageUnavailableError)return {title:'Temporarily unavailable',robots:{index:false}};throw error; }
}
export default async function Page({params}:{params:Promise<{id:string}>}) {
 const {id}=await params;let entry:Entry|undefined;
 try {entry=await record<Entry>('entry',id);} catch(error) {if(error instanceof StorageUnavailableError)return <StorageUnavailable/>;throw error;}
 if(!entry?.published)notFound();
 return <PublishedEntry entry={entry}/>;
}
