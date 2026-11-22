import { randomUUID, randomBytes, createHash } from 'node:crypto';
import type { Product, Entry, Order, DashboardData } from './store-types';
import { getDatabase, type SqlValue } from './database-client.mjs';
export function db(){return {
 prepare(sql:string){return {
  async all(...args:SqlValue[]){return (await (await getDatabase()).execute({sql,args})).rows;},
  async get(...args:SqlValue[]){return (await (await getDatabase()).execute({sql,args})).rows[0];},
  async run(...args:SqlValue[]){return (await getDatabase()).execute({sql,args});},
 };},
 async exec(sql:string){for(const statement of sql.split(';').filter(s=>s.trim()))await (await getDatabase()).execute(statement);},
};}

type RecordKind = 'product' | 'entry' | 'order' | 'enquiry';
export async function records<T>(kind: RecordKind): Promise<T[]> {
  return (await db().prepare('SELECT value FROM records WHERE kind=? ORDER BY rowid DESC').all(kind)).map(row => JSON.parse(String(row.value)) as T);
}
export async function record<T>(kind: RecordKind, id: string): Promise<T | undefined> {
  const row = await db().prepare('SELECT value FROM records WHERE kind=? AND id=?').get(kind, id);
  return row ? JSON.parse(String(row.value)) as T : undefined;
}
async function save(kind: RecordKind, value: { id: string }) {
  await db().prepare('INSERT INTO records(id,kind,value) VALUES(?,?,?) ON CONFLICT(id) DO UPDATE SET value=excluded.value WHERE records.kind=excluded.kind')
    .run(value.id, kind, JSON.stringify(value));
}
function text(value: unknown, label: string, max: number, required = true): string {
  if (typeof value !== 'string' || value.length > max || (required && !value.trim())) throw new Error(`${label} is required and must be under ${max} characters.`);
  return value.trim();
}
function boolean(value: unknown): boolean {
  if (typeof value !== 'boolean') throw new Error('Invalid visibility or availability.');
  return value;
}
function number(value: unknown, label: string, max: number, integer = false) {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value > max || (integer && !Number.isInteger(value))) throw new Error(`Invalid ${label}.`);
  return value;
}
async function identity(kind: RecordKind, input: Record<string, unknown>) {
  if (!input.id) return randomUUID();
  const id = text(input.id, 'ID', 80);
  if (!await record(kind, id)) throw new Error('Record not found. Refresh and try again.');
  return id;
}
export async function saveProduct(input: Record<string, unknown>): Promise<Product> {
  const product: Product = {
    id: await identity('product', input),
    title: text(input.title, 'English product name', 160), titleSi: text(input.titleSi, 'Sinhala product name', 200),
    description: text(input.description, 'English description', 3000), descriptionSi: text(input.descriptionSi, 'Sinhala description', 4000),
    category: text(input.category, 'Category', 80), duration: text(input.duration, 'Subscription duration', 100),
    durationSi: text(input.durationSi, 'Sinhala duration', 100),
    price: Math.round(number(input.price, 'price', 100000000) * 100) / 100,
    available: boolean(input.available), published: boolean(input.published), updatedAt: new Date().toISOString(),
  };
  await save('product', product); return product;
}
export async function saveEntry(input: Record<string, unknown>): Promise<Entry> {
  if (input.kind !== 'blog' && input.kind !== 'project') throw new Error('Choose blog or project.');
  const entry: Entry = {
    id: await identity('entry', input), kind: input.kind,
    title: text(input.title, 'English title', 200), titleSi: text(input.titleSi, 'Sinhala title', 240),
    summary: text(input.summary, 'English summary', 1000), summarySi: text(input.summarySi, 'Sinhala summary', 1500),
    body: text(input.body, 'English content', 20000), bodySi: text(input.bodySi, 'Sinhala content', 25000),
    published: boolean(input.published), updatedAt: new Date().toISOString(),
  };
  await save('entry', entry); return entry;
}
export async function saveOrder(input: Record<string, unknown>, persist=true): Promise<Order> {
  const id = await identity('order', input);
  const existing = await record<Order>('order', id);
  const product = await record<Product>('product', text(input.productId, 'Product', 80));
  if (!product) throw new Error('Choose an existing product.');
  if (!['pending', 'confirmed', 'completed', 'cancelled'].includes(String(input.status))) throw new Error('Invalid order status.');
  const quantity = number(input.quantity, 'quantity', 1000, true);
  if (quantity < 1) throw new Error('Quantity must be at least one.');
  const sameProduct = existing?.productId === product.id;
  const order: Order = {
    id, productId: product.id, productTitle: sameProduct ? existing.productTitle : product.title,
    customer: text(input.customer, 'Customer name', 160), phone: text(input.phone, 'Customer contact', 100),
    quantity, unitPrice: sameProduct ? existing.unitPrice : product.price,
    duration: sameProduct ? existing.duration : product.duration,
    status: input.status as Order['status'], notes: text(input.notes, 'Notes', 2000, false),
    createdAt: existing?.createdAt || new Date().toISOString(), updatedAt: new Date().toISOString(),
  };
  if(persist)await save('order', order); return order;
}
export async function dashboard(): Promise<DashboardData> {
  return { products: await records<Product>('product'), entries: await records<Entry>('entry'), orders: await records<Order>('order'), enquiries: await records('enquiry') };
}

export async function createEnquiry(input: Record<string, unknown>) {
  const email = text(input.email, 'Email', 254);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Enter a valid email address.');
  const value = { id: randomUUID(), name: text(input.name, 'Name', 100), email,
    service: text(input.service, 'Service', 160), message: text(input.message, 'Message', 4000), createdAt: new Date().toISOString() };
  if (value.message.length < 15) throw new Error('Please provide at least 15 characters about your project.');
  await save('enquiry', value);
  return { reference: value.id };
}

export async function createPublicOrder(input: Record<string, unknown>) {
  const product = await record<Product>('product', text(input.productId, 'Product', 80));
  if (!product?.published || !product.available) throw new Error('This subscription is not available.');
  const order = await saveOrder({ productId: product.id, customer: input.customer, phone: input.phone, quantity: input.quantity, status: 'pending', notes: '' },false);
  const code = randomBytes(24).toString('hex');
  await (await getDatabase()).batch([
    {sql:'INSERT INTO records(id,kind,value) VALUES(?,?,?)',args:[order.id,'order',JSON.stringify(order)]},
    {sql:'INSERT INTO order_tracking(token,order_id) VALUES(?,?)',args:[createHash('sha256').update(code).digest('hex'),order.id]},
  ]);
  return { reference: order.id, code, total: order.unitPrice * order.quantity };
}

export async function trackOrder(code: unknown) {
  if (typeof code !== 'string' || !/^[a-f0-9]{48}$/.test(code)) return null;
  const row = await db().prepare('SELECT order_id FROM order_tracking WHERE token=?').get(createHash('sha256').update(code).digest('hex'));
  const order = row && await record<Order>('order', String(row.order_id));
  return order ? { reference: order.id, product: order.productTitle, quantity: order.quantity, total: order.unitPrice * order.quantity, status: order.status, updatedAt: order.updatedAt } : null;
}
