import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { articles, site } from '@/lib/site';
import { ArticleContent } from '@/components/article';
export function generateStaticParams() { return articles.map(a => ({ slug: a.slug })); }
export async function generateMetadata({ params }: { params: Promise<{slug:string}> }): Promise<Metadata> {
 const {slug}=await params; const a=articles.find(a=>a.slug===slug);
 return a?{title:a.title,description:a.summary,...(site.url?{alternates:{canonical:`${site.url}/blog/${slug}`}}:{})}:{};
}
export default async function Article({params}:{params:Promise<{slug:string}>}) {
 const {slug}=await params; const index=articles.findIndex(a=>a.slug===slug); if(index<0) notFound();
 return <ArticleContent index={index}/>;
}
