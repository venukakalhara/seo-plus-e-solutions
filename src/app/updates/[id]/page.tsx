import { notFound } from 'next/navigation';
import { record } from '@/lib/database';
import type { Entry } from '@/lib/store-types';
import { PublishedEntry } from '@/components/published-content';
export const dynamic='force-dynamic';
export const runtime='nodejs';
export async function generateMetadata({params}:{params:Promise<{id:string}>}) {
 const {id}=await params;const entry=record<Entry>('entry',id);
 return entry?.published?{title:entry.title,description:entry.summary}:{title:'Not found'};
}
export default async function Page({params}:{params:Promise<{id:string}>}) {
 const {id}=await params; const entry=record<Entry>('entry',id);
 if(!entry?.published)notFound();
 return <PublishedEntry entry={entry}/>;
}
