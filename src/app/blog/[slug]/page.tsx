import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { articles, site } from '@/lib/site';
import { Header, Footer } from '@/components/chrome';
export function generateStaticParams() { return articles.map(a => ({ slug: a.slug })); }
export async function generateMetadata({ params }: { params: Promise<{slug:string}> }): Promise<Metadata> {
  const { slug } = await params; const a = articles.find(a => a.slug === slug);
  return a ? { title:a.title, description:a.summary, ...(site.url ? { alternates:{canonical:`${site.url}/blog/${slug}`} } : {}) } : {};
}
export default async function Article({params}:{params:Promise<{slug:string}>}) {
  const {slug} = await params; const article = articles.find(a=>a.slug===slug); if(!article) notFound();
  return <div id="top"><Header/><main id="main" className="container article-page"><Link href="/#blog" className="text-link">← Back to insights</Link><div className="eyebrow mt-10">{article.category} / FIELD NOTES</div><h1>{article.title}</h1><p className="lede">{article.summary}</p>{article.paragraphs.map(p=><p key={p}>{p}</p>)}<Link href="/#contact" className="button button-gold">Explore your next step <ArrowUpRight size={18}/></Link></main><Footer/></div>;
}
