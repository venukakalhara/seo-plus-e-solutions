import { StorageUnavailable } from '@/components/storage-unavailable';
import { StorageUnavailableError } from '@/lib/storage-error';
import { pageMetadata } from '@/lib/metadata';
import { Store } from '@/components/store';
import { records } from '@/lib/database';
import type { Product } from '@/lib/store-types';
export const generateMetadata=()=>pageMetadata('/store');
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export default async function Page() {
 let items:Product[];
 try { items=await records<Product>('product'); } catch(error) {if(error instanceof StorageUnavailableError)return <StorageUnavailable/>;throw error;}
 return <Store products={items.filter(p=>p.published)}/>;
}
