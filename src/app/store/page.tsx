import { Store } from '@/components/store';
import { records } from '@/lib/database';
import type { Product } from '@/lib/store-types';
export const metadata = { title: 'Software Store', description: 'Explore software subscriptions from SEO PLUS. Order through WhatsApp.' };
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export default function StorePage() { return <Store products={records<Product>('product').filter(p=>p.published)}/>; }
