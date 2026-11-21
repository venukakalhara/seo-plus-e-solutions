import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { site } from './site';
import { titles } from './content';
export async function pageMetadata(path:string,title?:string,description?:string,titleSi?:string,descriptionSi?:string):Promise<Metadata>{
 const extra:Record<string,string[]>={
  '/':['Web development, SEO & automation','වෙබ් නිර්මාණය, SEO සහ ස්වයංක්‍රීයකරණය',site.description,'වෙබ් නිර්මාණය, සෙවුම් උපායමාර්ග සහ ව්‍යාපාර ස්වයංක්‍රීයකරණය සඳහා SEO PLUS.'],
  '/store':['Software subscriptions','මෘදුකාංග දායකත්වයන්','Browse software subscriptions, submit an order request and track its progress. Payment and activation are arranged after confirmation.','මෘදුකාංග දායකත්ව බලන්න, ඇණවුම් ඉල්ලීමක් යවන්න සහ තත්ත්වය පරීක්ෂා කරන්න. තහවුරු කිරීමෙන් පසු ගෙවීම සහ සක්‍රිය කිරීම සකස් කෙරේ.'],
  '/privacy':['Your privacy','ඔබේ පෞද්ගලිකත්වය','How SEO PLUS handles enquiries, order requests, private tracking codes and admin sessions.','SEO PLUS ඔබේ විමසීම්, ඇණවුම් ඉල්ලීම් සහ tracking codes භාවිත කරන ආකාරය.'],
 };
 const si=(await headers()).get('x-site-language')==='si';const copy=titles[path.slice(1)]||extra[path];
 const name=si?(titleSi||copy?.[1]||title||'SEO PLUS ඩිජිටල් විසඳුම්'):(title||copy?.[0]||'SEO PLUS — Digital solutions');
 const summary=si?(descriptionSi||copy?.[3]||'වෙබ් නිර්මාණය, SEO, ඩිජිටල් අලෙවිකරණය සහ ව්‍යාපාර ස්වයංක්‍රීයකරණය සඳහා SEO PLUS අමතන්න.'):(description||copy?.[2]||site.description);
 const route=path==='/'?'':path;const url=site.url?`${site.url}${si?'/si':''}${route}`:undefined;
 return {title:name,description:summary,...(site.url?{alternates:{canonical:url,languages:{en:`${site.url}${route}`,si:`${site.url}/si${route}`,'x-default':`${site.url}${route}`}}}:{}),openGraph:{title:name,description:summary,url,locale:si?'si_LK':'en_LK',type:'website',images:[{url:'/seo-plus-logo.png',width:1280,height:1280,alt:'SEO PLUS'}]},twitter:{card:'summary',title:name,description:summary}};
}
