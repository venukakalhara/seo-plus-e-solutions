export type Product = {
  id: string; title: string; titleSi: string; description: string; descriptionSi: string;
  category: string; duration: string; durationSi: string; price: number;
  available: boolean; published: boolean; updatedAt: string;
};
export type Entry = {
  id: string; kind: 'blog' | 'project'; title: string; titleSi: string;
  summary: string; summarySi: string; body: string; bodySi: string;
  published: boolean; updatedAt: string;
};
export type Order = {
  id: string; productId: string; productTitle: string; customer: string;
  phone: string; quantity: number; unitPrice: number; duration: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes: string; createdAt: string; updatedAt: string;
};
export type DashboardData = { products: Product[]; entries: Entry[]; orders: Order[] };
