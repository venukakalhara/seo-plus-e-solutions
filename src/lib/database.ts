import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import type { Product, Entry, Order, DashboardData } from './store-types';

let connection: DatabaseSync | undefined;
export function db() {
  if (connection) return connection;
  const dir = path.resolve(process.env.SEO_DATA_DIR || path.join(process.cwd(), 'data'));
  mkdirSync(dir, { recursive: true });
  connection = new DatabaseSync(path.join(dir, 'seo-plus.sqlite'));
  connection.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA busy_timeout = 5000;
    CREATE TABLE IF NOT EXISTS records (
      id TEXT PRIMARY KEY, kind TEXT NOT NULL, value TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS sessions (token TEXT PRIMARY KEY, expires INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS login_attempts (id INTEGER PRIMARY KEY, at INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS admin (id INTEGER PRIMARY KEY CHECK(id=1), salt TEXT NOT NULL, hash TEXT NOT NULL);
  `);
  return connection;
}
type RecordKind = 'product' | 'entry' | 'order';
export function records<T>(kind: RecordKind): T[] {
  return db().prepare('SELECT value FROM records WHERE kind=? ORDER BY rowid DESC').all(kind).map(row => JSON.parse(String(row.value)) as T);
}
export function record<T>(kind: RecordKind, id: string): T | undefined {
  const row = db().prepare('SELECT value FROM records WHERE kind=? AND id=?').get(kind, id);
  return row ? JSON.parse(String(row.value)) as T : undefined;
}
function save(kind: RecordKind, value: { id: string }) {
  db().prepare('INSERT INTO records(id,kind,value) VALUES(?,?,?) ON CONFLICT(id) DO UPDATE SET value=excluded.value WHERE records.kind=excluded.kind')
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
function identity(kind: RecordKind, input: Record<string, unknown>) {
  if (!input.id) return randomUUID();
  const id = text(input.id, 'ID', 80);
  if (!record(kind, id)) throw new Error('Record not found. Refresh and try again.');
  return id;
}
export function saveProduct(input: Record<string, unknown>): Product {
  const product: Product = {
    id: identity('product', input),
    title: text(input.title, 'English product name', 160), titleSi: text(input.titleSi, 'Sinhala product name', 200),
    description: text(input.description, 'English description', 3000), descriptionSi: text(input.descriptionSi, 'Sinhala description', 4000),
    category: text(input.category, 'Category', 80), duration: text(input.duration, 'Subscription duration', 100),
    durationSi: text(input.durationSi, 'Sinhala duration', 100),
    price: Math.round(number(input.price, 'price', 100000000) * 100) / 100,
    available: boolean(input.available), published: boolean(input.published), updatedAt: new Date().toISOString(),
  };
  save('product', product); return product;
}
export function saveEntry(input: Record<string, unknown>): Entry {
  if (input.kind !== 'blog' && input.kind !== 'project') throw new Error('Choose blog or project.');
  const entry: Entry = {
    id: identity('entry', input), kind: input.kind,
    title: text(input.title, 'English title', 200), titleSi: text(input.titleSi, 'Sinhala title', 240),
    summary: text(input.summary, 'English summary', 1000), summarySi: text(input.summarySi, 'Sinhala summary', 1500),
    body: text(input.body, 'English content', 20000), bodySi: text(input.bodySi, 'Sinhala content', 25000),
    published: boolean(input.published), updatedAt: new Date().toISOString(),
  };
  save('entry', entry); return entry;
}
export function saveOrder(input: Record<string, unknown>): Order {
  const id = identity('order', input);
  const existing = record<Order>('order', id);
  const product = record<Product>('product', text(input.productId, 'Product', 80));
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
  save('order', order); return order;
}
export function dashboard(): DashboardData {
  return { products: records<Product>('product'), entries: records<Entry>('entry'), orders: records<Order>('order') };
}
